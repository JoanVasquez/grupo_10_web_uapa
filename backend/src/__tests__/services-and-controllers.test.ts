import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BaseController from '../controller/base-controller';
import AuthController from '../controller/auth-controller';
import ProductController from '../controller/product-controller';
import { GenericService } from '../service/generic-service';
import { UserService } from '../service/user-service';
import { DuplicateRecordError } from '../error/duplicate-record-error';
import { AuthError } from '../error/auth-error';
import { Product } from '../entity/product-entity';
import { User } from '../entity/user-entity';
import { ICRUD } from '../types/ICRUD';
import { IRepository } from '../types/IRepository';

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

type ProductRecord = Product & { id: string };

class ProductServiceUnderTest extends GenericService<ProductRecord> {
  constructor(repository: IRepository<ProductRecord>) {
    super(repository, Product as new () => ProductRecord);
  }
}

class ProductControllerUnderTest extends BaseController<ProductRecord> {}

const createResponse = (): Pick<Response, 'status' | 'send' | 'cookie' | 'clearCookie'> => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
});

describe('services and controllers', () => {
  it('delegates generic service CRUD operations to the repository', async () => {
    const repository: jest.Mocked<IRepository<ProductRecord>> = {
      create: jest.fn().mockResolvedValue({ id: '1', code: 'A1', name: 'Item', price: 5, description: '', category: 'Tech', brand: 'Brand', model: 'M1', stock: 2 }),
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(true),
      findAll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };
    const service = new ProductServiceUnderTest(repository);

    await service.save({ code: 'A1' });
    await service.findById('1');
    await service.update('1', { name: 'Updated' });
    await service.delete('1');
    await service.findAll(1, 10);

    expect(repository.create).toHaveBeenCalledWith({ code: 'A1' });
    expect(repository.findById).toHaveBeenCalledWith('1');
    expect(repository.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(repository.delete).toHaveBeenCalledWith('1');
    expect(repository.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('hashes passwords and rejects duplicate users', async () => {
    const repository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    const service = new UserService(repository as never);

    repository.findByEmail.mockResolvedValueOnce(null);
    jest.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    repository.create.mockResolvedValue({ id: '1', email: 'mail@test.com', username: 'user', password: 'hashed-password', is_active: true });

    const created = await service.save({ email: 'mail@test.com', username: 'user', password: 'secret' });

    expect(created.password).toBe('hashed-password');
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed-password' }));

    repository.findByEmail.mockResolvedValueOnce({ id: '1' });
    await expect(service.save({ email: 'mail@test.com', password: 'secret' })).rejects.toBeInstanceOf(DuplicateRecordError);
  });

  it('validates login credentials', async () => {
    const repository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    const service = new UserService(repository as never);

    repository.findByEmail.mockResolvedValue({ id: '1', email: 'mail@test.com', username: 'user', password: 'hashed', is_active: true });
    jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const user = await service.login('mail@test.com', 'secret');
    expect(user.email).toBe('mail@test.com');

    repository.findByEmail.mockResolvedValueOnce(null);
    await expect(service.login('missing@test.com', 'secret')).rejects.toBeInstanceOf(AuthError);

    repository.findByEmail.mockResolvedValueOnce({ id: '1', email: 'mail@test.com', username: 'user', password: 'hashed', is_active: true });
    jest.mocked(bcrypt.compare).mockResolvedValue(false as never);
    await expect(service.login('mail@test.com', 'secret')).rejects.toBeInstanceOf(AuthError);
  });

  it('serializes controller CRUD responses and defaults pagination values', async () => {
    const crud: jest.Mocked<ICRUD<ProductRecord>> = {
      save: jest.fn().mockResolvedValue({ id: '1', code: 'A1', name: 'Item', price: 5, description: '', category: 'Tech', brand: 'Brand', model: 'M1', stock: 2 }),
      findById: jest.fn().mockResolvedValue({ id: '1', code: 'A1', name: 'Item', price: 5, description: '', category: 'Tech', brand: 'Brand', model: 'M1', stock: 2 }),
      update: jest.fn().mockResolvedValue({ id: '1', code: 'A1', name: 'Updated', price: 5, description: '', category: 'Tech', brand: 'Brand', model: 'M1', stock: 2 }),
      delete: jest.fn().mockResolvedValue(true),
      findAll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };
    const controller = new ProductControllerUnderTest(crud);
    const response = createResponse();
    const next = jest.fn() as NextFunction;

    await controller.save?.({ body: { code: 'A1' } } as Request, response as Response, next);
    await controller.update?.({ body: { name: 'Updated' }, params: { id: '1' } } as unknown as Request, response as Response, next);
    await controller.delete?.({ params: { id: '1' } } as unknown as Request, response as Response, next);
    await controller.findById?.({ params: { id: '1' } } as unknown as Request, response as Response, next);
    await controller.findAll?.({ query: {} } as unknown as Request, response as Response, next);

    expect(crud.save).toHaveBeenCalledWith({ code: 'A1' });
    expect(crud.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(crud.delete).toHaveBeenCalledWith('1');
    expect(crud.findById).toHaveBeenCalledWith('1');
    expect(crud.findAll).toHaveBeenCalledWith(1, 10);
    expect(response.status).toHaveBeenCalledTimes(5);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes controller errors to next when ids are missing or services fail', async () => {
    const serviceError = new Error('broken');
    const crud: jest.Mocked<ICRUD<ProductRecord>> = {
      save: jest.fn().mockRejectedValue(serviceError),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    const controller = new ProductControllerUnderTest(crud);
    const response = createResponse();
    const next = jest.fn() as NextFunction;

    await controller.save?.({ body: { code: 'A1' } } as Request, response as Response, next);
    await controller.update?.({ body: {}, params: {} } as unknown as Request, response as Response, next);
    await controller.delete?.({ params: {} } as unknown as Request, response as Response, next);
    await controller.findById?.({ params: {} } as unknown as Request, response as Response, next);
    crud.findAll.mockRejectedValueOnce(serviceError);
    await controller.findAll?.({ query: { page: '2', per_page: '5' } } as unknown as Request, response as Response, next);

    expect(next).toHaveBeenNthCalledWith(1, serviceError);
    expect(next).toHaveBeenNthCalledWith(2, expect.any(Error));
    expect(next).toHaveBeenNthCalledWith(3, expect.any(Error));
    expect(next).toHaveBeenNthCalledWith(4, expect.any(Error));
    expect(next).toHaveBeenNthCalledWith(5, serviceError);
  });

  it('creates auth register, login, logout responses and forwards auth failures', async () => {
    const userService = {
      save: jest.fn().mockResolvedValue({ id: '2', username: 'created' } as User),
      login: jest.fn().mockResolvedValue({ id: '1', username: 'tester' } as User),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    const controller = new AuthController(userService as never);
    const response = createResponse();
    const next = jest.fn() as NextFunction;

    (jwt.sign as jest.Mock).mockReturnValue('signed-token');

    await controller.register({ body: { email: 'mail@test.com' } } as Request, response as Response, next);
    await controller.login({ body: { email: 'mail@test.com', password: 'secret' } } as Request, response as Response, next);
    await controller.logout({} as Request, response as Response, next);

    expect(userService.save).toHaveBeenCalledWith({ email: 'mail@test.com' });
    expect(response.cookie).toHaveBeenCalledWith('token', 'signed-token', expect.objectContaining({ httpOnly: true }));
    expect(response.clearCookie).toHaveBeenCalledWith('token', expect.objectContaining({ httpOnly: true }));

    userService.login.mockResolvedValueOnce(null);
    await controller.login({ body: { email: 'mail@test.com', password: 'secret' } } as Request, response as Response, next);
    expect(next).toHaveBeenLastCalledWith(expect.any(AuthError));
  });

  it('keeps product controller wired to the given service', () => {
    const crud = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as unknown as ICRUD<Product>;

    const controller = new ProductController(crud);
    expect(controller).toBeInstanceOf(BaseController);
  });
});
