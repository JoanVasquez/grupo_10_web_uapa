import { GenericService } from "./generic-service";
import { inject, injectable } from "tsyringe";
import { User } from "../entity/user-entity";
import { UserRepository } from "../repository/user-repository";
import { DuplicateRecordError } from "../error/duplicate-record-error";
import bcrypt from "bcryptjs";
import { AuthError } from "../error/auth-error";

@injectable()
export class UserService extends GenericService<User> {
  constructor(@inject("UserRepository") private readonly userRepository: UserRepository) {
    super(userRepository, User);
  }

  override async save(entity: Partial<User>): Promise<User> {
    if (!entity.email || !entity.password) {
      throw new AuthError("Email and password are required");
    }

    const existingUser = await this.userRepository.findByEmail(entity.email);
    if (existingUser) {
      throw new DuplicateRecordError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(entity.password, 12);
    const user = await this.userRepository.create({
      ...entity,
      password: hashedPassword,
    } as User);

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user?.is_active || !user.password) {
      throw new AuthError("User Inactive");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AuthError("Invalid Password");
    }

    return user;
  }
}
