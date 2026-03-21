import { ICRUD } from "../types/ICRUD";
import { IRepository } from "../types/IRepository";

export abstract class GenericService<T> implements ICRUD<T> {
  constructor(
    protected genericRepository: IRepository<T>,
    protected entityClass: new () => T,
  ) { }

  save(entity: Partial<T>): Promise<T> {
    console.log(entity);
    return this.genericRepository.create(entity);
  }
  findById(id: string): Promise<T | null> {
    return this.genericRepository.findById(id);
  }
  update(id: string, entity: Partial<T>): Promise<T | null> {
    return this.genericRepository.update(id, entity);
  }
  delete(id: string): Promise<boolean> {
    return this.genericRepository.delete(id);
  }
  findAll(page: number, limit: number): Promise<{ items: T[]; total: number }> {
    return this.genericRepository.findAll(page, limit);
  }
}
