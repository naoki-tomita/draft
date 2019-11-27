import { UsersUsecase } from "../";
import { register } from "omusubi";
import { UsersPort, UserNotFoundError } from "../../port";
import { when } from "jest-when";
import { LoginId } from "../../domain";

describe("UsersUsecase", () => {
  let usersPort: UsersPort;
  let usersUsecase: UsersUsecase;
  beforeEach(() => {
    usersPort = {} as any;
    register(usersPort).as(UsersPort);
    usersUsecase = new UsersUsecase();
  });
  describe("list", () => {
    it("should returns Users.", async () => {
      const list = usersPort.list = jest.fn();
      const users = jest.fn();

      when(list).calledWith().mockReturnValueOnce(users);

      expect(await usersUsecase.list()).toBe(users);
    });
  });
  describe("findById", () => {
    it("should returns User.", async () => {
      const findById = usersPort.findById = jest.fn();
      const user = jest.fn();
      const id = new LoginId("id")

      when(findById).calledWith(id).mockReturnValueOnce(user);

      expect(await usersUsecase.findById(id)).toBe(user);
      when(findById).expectCalledWith(id);
    });
    it("should throw exeption if not found user.", async () => {
      const findById = usersPort.findById = jest.fn();
      const id = new LoginId("id")

      when(findById).calledWith(id).mockReturnValueOnce(null);

      expect(usersUsecase.findById(id)).rejects.toThrow();
      when(findById).expectCalledWith(id);
    });
  });
  describe("create", () => {
    it("should returns User.", async () => {
      const create = usersPort.create = jest.fn();
      const user = jest.fn();
      const id = new LoginId("id")

      when(create).calledWith(id).mockReturnValueOnce(user);

      expect(await usersUsecase.create(id)).toBe(user);
      when(create).expectCalledWith(id);
    });
    it("should throw exception when already exists.", () => {
      const create = usersPort.create = jest.fn();
      const id = new LoginId("id")

      when(create).calledWith(id).mockReturnValueOnce(null);

      expect(usersUsecase.create(id)).rejects.toThrow();
      when(create).expectCalledWith(id);
    });
  });
});
