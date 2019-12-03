import { UsersUsecase, CandidatesUsecase } from "../";
import { register } from "omusubi";
import { UsersPort, CandidatesPort } from "../../port";
import { when } from "jest-when";
import { LoginId, CandidateId, RecommendMessage, Good } from "../../domain";

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
      const list = (usersPort.list = jest.fn());
      const users = jest.fn();

      when(list)
        .calledWith()
        .mockReturnValueOnce(users);

      expect(await usersUsecase.list()).toBe(users);
    });
  });
  describe("findById", () => {
    it("should returns User.", async () => {
      const findById = (usersPort.findByLoginId = jest.fn());
      const user = jest.fn();
      const id = new LoginId("id");

      when(findById)
        .calledWith(id)
        .mockReturnValueOnce(user);

      expect(await usersUsecase.findByLoginId(id)).toBe(user);
      when(findById).expectCalledWith(id);
    });
    it("should throw exeption if not found user.", async () => {
      const findById = (usersPort.findByLoginId = jest.fn());
      const id = new LoginId("id");

      when(findById)
        .calledWith(id)
        .mockReturnValueOnce(null);

      expect(usersUsecase.findByLoginId(id)).rejects.toThrow();
      when(findById).expectCalledWith(id);
    });
  });
  describe("create", () => {
    it("should returns User.", async () => {
      const findById = (usersPort.findByLoginId = jest.fn());
      const create = (usersPort.create = jest.fn());
      const user = jest.fn();
      const id = new LoginId("id");

      when(findById)
        .calledWith(id)
        .mockReturnValueOnce(null);
      when(create)
        .calledWith(id)
        .mockReturnValueOnce(user);

      expect(await usersUsecase.create(id)).toBe(user);
      when(create).expectCalledWith(id);
    });
    it("should throw exception when already exists.", () => {
      const findById = (usersPort.findByLoginId = jest.fn());
      const user = jest.fn();
      const id = new LoginId("id");

      when(findById)
        .calledWith(id)
        .mockReturnValueOnce(user);

      expect(usersUsecase.create(id)).rejects.toThrow();
      when(findById).expectCalledWith(id);
    });
  });
});

describe("RecommendsUsecase", () => {
  let recommendsPort: CandidatesPort;
  let recommendsUsecase: CandidatesUsecase;
  beforeEach(() => {
    recommendsPort = {} as any;
    register(recommendsPort).as(CandidatesPort);
    recommendsUsecase = new CandidatesUsecase();
  });
  describe("list", () => {
    it("should returns Users.", async () => {
      const list = (recommendsPort.list = jest.fn());
      const candidates = jest.fn();

      when(list)
        .calledWith()
        .mockReturnValueOnce(candidates);

      expect(await recommendsUsecase.list()).toBe(candidates);
    });
  });
  describe("findById", () => {
    it("should returns User.", async () => {
      const findById = (recommendsPort.findByCandidateId = jest.fn());
      const recommends = jest.fn();
      const id = new CandidateId(123);

      when(findById)
        .calledWith(id)
        .mockReturnValueOnce(recommends);

      expect(await recommendsUsecase.findById(id)).toBe(recommends);
      when(findById).expectCalledWith(id);
    });
  });
  describe("create", () => {
    it("should call create.", async () => {
      const create = (recommendsPort.create = jest.fn());
      const id = new CandidateId(99);
      const loginId = new LoginId("id");
      const recommend = new RecommendMessage("osusume");
      const good = new Good(true);

      await recommendsUsecase.create(id, loginId, recommend, good);
      when(create).expectCalledWith(id, loginId, recommend, good);
    });
  });
});
