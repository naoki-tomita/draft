import { register } from "omusubi";
import { when } from "jest-when";

import { UsersGateway, CandidatesGateway } from "..";
import { UsersDriver, RecommendsDriver, RecommendEntity } from "../../driver";
import {
  Users,
  User,
  LoginId,
  UserId,
  Candidates,
  Candidate,
  CandidateId,
  Recommends,
  Recommend,
  RecommendMessage
} from "../../domain";

describe("UsersGateway", () => {
  let usersDriver: UsersDriver;
  let usersGateway: UsersGateway;
  beforeEach(() => {
    usersDriver = {} as any;
    register(usersDriver).as(UsersDriver);
    usersGateway = new UsersGateway();
  });
  describe("list", () => {
    it("should returns Users.", async () => {
      const findAll = (usersDriver.findAll = jest.fn());
      const usersEntities = [];
      const mapMock = (usersEntities.map = jest.fn());
      const users = jest.fn();

      when(findAll)
        .calledWith()
        .mockReturnValueOnce(usersEntities);
      when(mapMock)
        .calledWith()
        .mockReturnValueOnce(users);

      expect(await usersGateway.list()).toEqual(
        new Users((users as unknown) as Array<User>)
      );
      when(findAll).expectCalledWith();
      when(mapMock).expectCalledWith();
    });
  });

  describe("create", () => {
    it("should create User and returns the User.", async () => {
      const loginId = new LoginId("loginId");
      const expected = new User(new UserId(1), loginId);
      const create = (usersDriver.create = jest.fn());
      const findByLoginId = (usersDriver.findByLoginId = jest.fn());

      when(findByLoginId)
        .calledWith("loginId")
        .mockReturnValueOnce({ id: 1, loginId: "loginId" });

      expect(await usersGateway.create(loginId)).toEqual(expected);
      when(create).expectCalledWith("loginId");
      when(findByLoginId).expectCalledWith("loginId");
    });
  });

  describe("findByLoginId", () => {
    it("should find user.", async () => {
      const id = new LoginId("id");
      const expected = new User(new UserId(1), id);
      const findByLoginId = (usersDriver.findByLoginId = jest.fn());

      when(findByLoginId)
        .calledWith("id")
        .mockReturnValue({ id: 1, loginId: "id" });

      expect(await usersGateway.findByLoginId(id)).toEqual(expected);
      when(findByLoginId).expectCalledWith("id");
    });

    it("should not find user if user not found.", async () => {
      const id = new LoginId("id");
      const findByLoginId = (usersDriver.findByLoginId = jest.fn());

      when(findByLoginId)
        .calledWith("id")
        .mockReturnValue(null);

      expect(await usersGateway.findByLoginId(id)).toEqual(null);
      when(findByLoginId).expectCalledWith("id");
    });
  });
});

describe("RecommendsGateway", () => {
  let recommendsDriver: RecommendsDriver;
  let usersDriver: UsersDriver;
  let candidatesGateway: CandidatesGateway;
  beforeEach(() => {
    recommendsDriver = {} as any;
    register(recommendsDriver).as(RecommendsDriver);
    usersDriver = {} as any;
    register(usersDriver).as(UsersDriver);
    candidatesGateway = new CandidatesGateway();
  });
  describe("list", () => {
    it("should return list", async () => {
      const recommendEntities: RecommendEntity[] = [
        { id: 0, candidateId: 0, recommenderId: 10, recommend: "message10" },
        { id: 1, candidateId: 0, recommenderId: 20, recommend: "message20" },
        { id: 2, candidateId: 1, recommenderId: 30, recommend: "message30" }
      ];
      const user10Entity = { id: 10, loginId: "foo" };
      const user20Entity = { id: 20, loginId: "bar" };
      const user30Entity = { id: 30, loginId: "hoge" };
      const findAll = (recommendsDriver.findAll = jest.fn());
      const findById = (usersDriver.findById = jest.fn());

      when(findAll)
        .calledWith()
        .mockReturnValueOnce(recommendEntities);
      when(findById)
        .calledWith(10)
        .mockReturnValueOnce(user10Entity);
      when(findById)
        .calledWith(20)
        .mockReturnValueOnce(user20Entity);
      when(findById)
        .calledWith(30)
        .mockReturnValueOnce(user30Entity);

      const expected = new Candidates([
        new Candidate(
          new CandidateId(0),
          new Recommends([
            new Recommend(
              new User(new UserId(10), new LoginId("foo")),
              new RecommendMessage("message10")
            ),
            new Recommend(
              new User(new UserId(20), new LoginId("bar")),
              new RecommendMessage("message20")
            )
          ])
        ),
        new Candidate(
          new CandidateId(1),
          new Recommends([
            new Recommend(
              new User(new UserId(30), new LoginId("hoge")),
              new RecommendMessage("message30")
            )
          ])
        )
      ]);

      expect(await candidatesGateway.list()).toEqual(expected);
    });
  });

  describe("create", () => {
    it("should create", async () => {
      const id = new CandidateId(0);
      const recommenderId = new LoginId("foo");
      const message = new RecommendMessage("message");
      const findByLoginId = (usersDriver.findByLoginId = jest.fn());
      const create = (recommendsDriver.create = jest.fn());

      when(findByLoginId)
        .calledWith(recommenderId.value)
        .mockReturnValueOnce({ id: 10 });
      await candidatesGateway.create(id, recommenderId, message);
      when(create).expectCalledWith(
        id.value,
        recommenderId.value,
        message.value
      );
    });
  });
});
