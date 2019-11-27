import { register } from "omusubi";
import { when } from "jest-when";

import { UsersGateway } from "..";
import { UsersDriver, UserEntity } from "../../driver";
import { Users, User } from "../../domain";

describe("UsersUsecase", () => {
  let usersDriver: UsersDriver;
  let usersGateway: UsersGateway;
  beforeEach(() => {
    usersDriver = {} as any;
    register(usersDriver).as(UsersDriver);
    usersGateway = new UsersGateway();
  });
  describe("list", () => {
    it("should returns Users.", async () => {
      const findAll = usersDriver.findAll = jest.fn();
      const usersEntities = [];
      const mapMock = usersEntities.map = jest.fn();
      const users = jest.fn();

      when(findAll).calledWith().mockReturnValueOnce(usersEntities);
      when(mapMock).calledWith().mockReturnValueOnce(users);

      expect(await usersGateway.list()).toEqual(new Users(users as unknown as Array<User>));
      when(findAll).expectCalledWith();
      when(mapMock).expectCalledWith();
    });
  });
});
