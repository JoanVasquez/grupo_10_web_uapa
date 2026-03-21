import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { errorHandler } from '../middleware/error-handler';
import { validateRequest } from '../middleware/validate-request';
import { AuthError } from '../error/auth-error';

jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
  JsonWebTokenError: class MockJsonWebTokenError extends Error {},
  TokenExpiredError: class MockTokenExpiredError extends Error {
    constructor() {
      super('expired');
    }
  },
  NotBeforeError: class MockNotBeforeError extends Error {},
}));

jest.mock('express-validator', () => {
  const buildChain = () => ({
    isEmail: buildChain,
    normalizeEmail: buildChain,
    trim: buildChain,
    isLength: buildChain,
    notEmpty: buildChain,
    isFloat: buildChain,
    isInt: buildChain,
    isNumeric: buildChain,
    withMessage: buildChain,
  });

  return {
    body: buildChain,
    query: buildChain,
    validationResult: jest.fn(),
  };
});

const { validationResult } = jest.requireMock('express-validator') as {
  validationResult: jest.Mock;
};

type ResponseDouble = Pick<Response, 'status' | 'send'>;

const createResponse = (): ResponseDouble => {
  const response: ResponseDouble = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };

  return response;
};

describe('middleware', () => {
  it('accepts valid bearer tokens', async () => {
    const nextMock = jest.fn();
    const next = nextMock as NextFunction;
    const req = {
      headers: { authorization: 'Bearer token-123' },
      cookies: {},
    } as Request;

    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-id' } as jwt.JwtPayload);

    await authenticateToken(req, {} as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith('token-123', expect.any(String));
    expect(nextMock).toHaveBeenCalledWith();
  });

  it('forwards auth errors for invalid tokens', async () => {
    const nextMock = jest.fn();
    const next = nextMock as NextFunction;
    const req = {
      headers: { authorization: 'Bearer expired-token' },
      cookies: {},
    } as Request;

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new TokenExpiredError('expired', new Date());
    });

    await authenticateToken(req, {} as Response, next);

    expect(nextMock.mock.calls[0]?.[0]).toBeInstanceOf(AuthError);
  });

  it('rejects missing tokens and invalid token payloads', async () => {
    const nextMissing = jest.fn() as NextFunction;
    await authenticateToken({ headers: {}, cookies: {} } as Request, {} as Response, nextMissing);
    expect(nextMissing).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unauthorized: No token provided' }));

    const nextInvalid = jest.fn() as NextFunction;
    (jwt.verify as jest.Mock).mockReturnValueOnce('plain-string-token');
    await authenticateToken(
      { headers: { authorization: 'Bearer malformed-token' }, cookies: {} } as Request,
      {} as Response,
      nextInvalid,
    );
    expect(nextInvalid).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid token structure' }));
  });

  it('maps not-before JWT errors and forwards unexpected auth failures', async () => {
    const nextNotBefore = jest.fn() as NextFunction;
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new NotBeforeError('inactive', new Date());
    });

    await authenticateToken(
      { headers: { authorization: 'Bearer early-token' }, cookies: {} } as Request,
      {} as Response,
      nextNotBefore,
    );
    expect(nextNotBefore).toHaveBeenCalledWith(expect.any(AuthError));

    const genericFailure = new Error('unexpected verify failure');
    const nextGeneric = jest.fn() as NextFunction;
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw genericFailure;
    });

    await authenticateToken(
      { headers: { authorization: 'Bearer broken-token' }, cookies: {} } as Request,
      {} as Response,
      nextGeneric,
    );
    expect(nextGeneric).toHaveBeenCalledWith(genericFailure);
  });

  it('formats known custom errors', () => {
    const response = createResponse();

    errorHandler(new AuthError('Denied'), {} as Request, response as Response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Denied' }));
  });

  it('formats validation errors', () => {
    const response = createResponse();
    const next = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Required field' }],
    });

    validateRequest({} as Request, response as Response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(expect.objectContaining({ data: [{ msg: 'Required field' }] }));
    expect(next).not.toHaveBeenCalled();
  });

  it('continues request flow when validation succeeds', () => {
    const response = createResponse();
    const next = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    validateRequest({} as Request, response as Response, next);

    expect(next).toHaveBeenCalledWith();
  });
});
