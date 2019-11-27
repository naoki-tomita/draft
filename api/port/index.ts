import { Users, User, LoginId } from "../domain";

export abstract class UsersPort {
  abstract async list(): Promise<Users>;
  abstract async create(id: LoginId): Promise<User>;
  abstract async findById(id: LoginId): Promise<User | null>;
}

export class UserNotFoundError extends Error {}
export class UserAlreadyExistError extends Error {}
