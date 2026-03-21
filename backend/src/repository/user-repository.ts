import { inject, injectable } from "tsyringe";
import { GenericRepository } from "./generic-repository";
import { User } from "../entity/user-entity";
import { DatabaseError } from "../error/database-error";

@injectable()
export class UserRepository extends GenericRepository<User> {
  constructor(
    @inject("AppDataSource")
    dataSource: ConstructorParameters<typeof GenericRepository<User>>[0],
  ) {
    super(dataSource, User);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repo.findOne({ where: { email } });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      throw new DatabaseError(`Error finding user by email: ${errorMessage}`);
    }
  }
}