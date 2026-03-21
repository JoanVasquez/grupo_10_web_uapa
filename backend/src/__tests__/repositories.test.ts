import "reflect-metadata";
import { DataSource, ObjectLiteral } from 'typeorm';
import { GenericRepository } from '../repository/generic-repository';
import { UserRepository } from '../repository/user-repository';
import { DatabaseError } from '../error/database-error';
import { DuplicateRecordError } from '../error/duplicate-record-error';
import { ForeignKeyViolationError } from '../error/foreign-key-violation-error';
import { NotFoundError } from '../error/not-found-error';
import { User } from '../entity/user-entity';

type EntityWithId = ObjectLiteral & { id: string; email?: string };

class RepositoryUnderTest extends GenericRepository<EntityWithId> {
  constructor(dataSource: DataSource) {
    super(dataSource, class TestEntity {
      id = '';
      email = '';
    });
  }
}

const buildRepositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
});

describe('repositories', () => {
  it('wraps create failures into repository errors', async () => {
    const repositoryMock = buildRepositoryMock();
    const dataSource = { getRepository: jest.fn().mockReturnValue(repositoryMock) } as unknown as DataSource;
    const repository = new RepositoryUnderTest(dataSource);

    repositoryMock.create.mockReturnValue({ id: '1' });
    repositoryMock.save.mockRejectedValueOnce({ code: '23505' });
    await expect(repository.create({ id: '1' })).rejects.toMatchObject({ code: '23505' });

    repositoryMock.save.mockRejectedValueOnce({ code: '23503' });
    await expect(repository.create({ id: '1' })).rejects.toMatchObject({ code: '23503' });
  });

  it('supports find/update/delete/findAll happy paths', async () => {
    const repositoryMock = buildRepositoryMock();
    const dataSource = { getRepository: jest.fn().mockReturnValue(repositoryMock) } as unknown as DataSource;
    const repository = new RepositoryUnderTest(dataSource);

    repositoryMock.findOneBy.mockResolvedValue({ id: '1' });
    repositoryMock.update.mockResolvedValue({ affected: 1 });
    repositoryMock.delete.mockResolvedValue({ affected: 1 });
    repositoryMock.findAndCount.mockResolvedValue([[{ id: '1' }], 1]);

    await expect(repository.findById('1')).resolves.toEqual({ id: '1' });
    await expect(repository.update('1', { email: 'mail@test.com' })).resolves.toEqual({ id: '1' });
    await expect(repository.delete('1')).resolves.toBe(true);
    await expect(repository.findAll(2, 5)).resolves.toEqual({ items: [{ id: '1' }], total: 1 });
  });

  it('throws not found and database errors where appropriate', async () => {
    const repositoryMock = buildRepositoryMock();
    const dataSource = { getRepository: jest.fn().mockReturnValue(repositoryMock) } as unknown as DataSource;
    const repository = new RepositoryUnderTest(dataSource);

    repositoryMock.findOneBy.mockResolvedValue(null);
    await expect(repository.findById('missing')).rejects.toBeInstanceOf(NotFoundError);

    repositoryMock.findOneBy.mockRejectedValueOnce(new Error('find broken'));
    await expect(repository.findById('1')).rejects.toBeInstanceOf(DatabaseError);

    repositoryMock.update.mockResolvedValueOnce({ affected: 0 });
    await expect(repository.update('1', { id: '1' })).rejects.toBeInstanceOf(NotFoundError);

    repositoryMock.update.mockRejectedValueOnce(new Error('broken'));
    await expect(repository.update('1', { id: '1' })).rejects.toBeInstanceOf(DatabaseError);

    repositoryMock.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(repository.delete('1')).rejects.toBeInstanceOf(NotFoundError);

    repositoryMock.delete.mockRejectedValueOnce(new Error('delete broken'));
    await expect(repository.delete('1')).rejects.toBeInstanceOf(DatabaseError);

    repositoryMock.findAndCount.mockRejectedValueOnce(new Error('list broken'));
    await expect(repository.findAll(1, 10)).rejects.toBeInstanceOf(DatabaseError);
  });

  it('finds users by email and wraps query failures', async () => {
    const repositoryMock = buildRepositoryMock();
    const dataSource = { getRepository: jest.fn().mockReturnValue(repositoryMock) } as unknown as DataSource;
    const repository = new UserRepository(dataSource);

    repositoryMock.findOne.mockResolvedValue({ id: '1', email: 'mail@test.com' } as User);
    await expect(repository.findByEmail('mail@test.com')).resolves.toEqual({ id: '1', email: 'mail@test.com' });

    repositoryMock.findOne.mockRejectedValue(new Error('db down'));
    await expect(repository.findByEmail('mail@test.com')).rejects.toBeInstanceOf(DatabaseError);
  });
});
