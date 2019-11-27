import { User, Users, LoginId } from "../domain";
import { UsersPort } from "../port";
import { inject } from "omusubi";
import { UsersDriver } from "../driver";

export class UsersGateway extends UsersPort {

  @inject(UsersDriver)
  usersDriver: UsersDriver;

  async list(): Promise<Users> {
    const users = await this.usersDriver.findAll();
    return new Users(
      users.map(User.from)
    );
  }
  create(): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findById(): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
