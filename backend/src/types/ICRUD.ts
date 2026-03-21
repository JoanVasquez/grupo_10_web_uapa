export interface ICRUD<T> {
  save(entity: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(page: number, limit: number): Promise<{ items: T[]; total: number }>;
}
