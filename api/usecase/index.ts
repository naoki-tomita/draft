import { inject, register } from "omusubi";
import { UsersPort, UserNotFoundError } from "../port";
import { User, LoginId, Users } from "../domain";
import { UsersGateway } from "../gateway";
import { UsersDriver } from "../driver";

export class UsersUsecase {
  @inject(UsersPort)
  usersPort: UsersPort;

  async create(id: LoginId): Promise<User> {
    const user = await this.usersPort.create(id);
    if (!user) {
      throw new UserNotFoundError(`user ${id.value} not found.`);
    }
    return user;
  }

  async findById(id: LoginId): Promise<User> {
    const user = await this.usersPort.findById(id);
    if (!user) {
      throw new UserNotFoundError(`user ${id.value} not found.`);
    }
    return user;
  }

  async list(): Promise<Users> {
    return await this.usersPort.list();
  }
}

export function getUsecases(): { usersUsecase: UsersUsecase } {
  register(new UsersGateway()).as(UsersPort);
  register(new UsersDriver()).as(UsersDriver);
  return {
    usersUsecase: new UsersUsecase()
  };
}
