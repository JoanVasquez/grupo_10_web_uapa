import ResponseTemplate from '../utils/response-template';
import { HttpStatus } from '../utils/http-status';
import { AuthError } from '../error/auth-error';
import { BaseAppException } from '../error/base-app-exception';
import { DatabaseError } from '../error/database-error';
import { DuplicateRecordError } from '../error/duplicate-record-error';
import { ForeignKeyViolationError } from '../error/foreign-key-violation-error';
import { NotFoundError } from '../error/not-found-error';

describe('backend errors and utils', () => {
  it('creates response templates with getters', () => {
    const template = new ResponseTemplate(201, 'CREATED', 'done', { id: '1' });

    expect(template.statusCode).toBe(201);
    expect(template.status).toBe('CREATED');
    expect(template.message).toBe('done');
    expect(template.data).toEqual({ id: '1' });
    expect(new Date(template.timeStamp).toString()).not.toBe('Invalid Date');
  });

  it('maps custom errors to the expected http metadata', () => {
    expect(new AuthError().statusCode).toBe(HttpStatus.FORBIDDEN.code);
    expect(new BaseAppException().statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR.code);
    expect(new DatabaseError().statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR.code);
    expect(new DuplicateRecordError().statusCode).toBe(HttpStatus.CONFLICT.code);
    expect(new ForeignKeyViolationError().statusCode).toBe(HttpStatus.BAD_REQUEST.code);
    expect(new NotFoundError('Product').message).toBe('Product not found');
  });
});
