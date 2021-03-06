import { register } from "omusubi";
import { when } from "jest-when";

import { UsersGateway, CandidatesGateway } from "..";
import {
  UsersDriver,
  RecommendsDriver,
  RecommendEntity,
  UserEntity
} from "../../driver";
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
  RecommendMessage,
  Good
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
        .mockReturnValueOnce({ id: 1, login_id: "loginId" });

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
        .mockReturnValue({ id: 1, login_id: "id" });

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
        {
          id: 0,
          candidate_id: 0,
          recommender_id: 10,
          recommend: "message10",
          good: false
        },
        {
          id: 1,
          candidate_id: 0,
          recommender_id: 20,
          recommend: "message20",
          good: true
        },
        {
          id: 2,
          candidate_id: 1,
          recommender_id: 30,
          recommend: "message30",
          good: false
        }
      ];
      const user10Entity: UserEntity = { id: 10, login_id: "foo" };
      const user20Entity: UserEntity = { id: 20, login_id: "bar" };
      const user30Entity: UserEntity = { id: 30, login_id: "hoge" };
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
              new RecommendMessage("message10"),
              new Good(false)
            ),
            new Recommend(
              new User(new UserId(20), new LoginId("bar")),
              new RecommendMessage("message20"),
              new Good(true)
            )
          ])
        ),
        new Candidate(
          new CandidateId(1),
          new Recommends([
            new Recommend(
              new User(new UserId(30), new LoginId("hoge")),
              new RecommendMessage("message30"),
              new Good(false)
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
      const good = new Good(false);
      const findByLoginId = (usersDriver.findByLoginId = jest.fn());
      const create = (recommendsDriver.create = jest.fn());

      when(findByLoginId)
        .calledWith(recommenderId.value)
        .mockReturnValueOnce({ id: 10 });
      await candidatesGateway.create(id, recommenderId, message, good);
      when(create).expectCalledWith(
        id.value,
        recommenderId.value,
        message.value,
        good.value
      );
    });
  });

  describe("findById", () => {
    it("should return candidate", async () => {
      const recommendEntities: RecommendEntity[] = [
        {
          id: 0,
          candidate_id: 0,
          recommender_id: 10,
          recommend: "message10",
          good: false
        },
        {
          id: 1,
          candidate_id: 0,
          recommender_id: 20,
          recommend: "message20",
          good: true
        }
      ];
      const user10Entity: UserEntity = { id: 10, login_id: "foo" };
      const user20Entity: UserEntity = { id: 20, login_id: "bar" };
      const findByCandidateId = (recommendsDriver.findByCandiidateId = jest.fn());
      const findByUserId = (usersDriver.findById = jest.fn());

      when(findByCandidateId)
        .calledWith(0)
        .mockReturnValueOnce(recommendEntities);
      when(findByUserId)
        .calledWith(10)
        .mockReturnValueOnce(user10Entity);
      when(findByUserId)
        .calledWith(20)
        .mockReturnValueOnce(user20Entity);

      const expected = new Candidate(
        new CandidateId(0),
        new Recommends([
          new Recommend(
            new User(new UserId(10), new LoginId("foo")),
            new RecommendMessage("message10"),
            new Good(false)
          ),
          new Recommend(
            new User(new UserId(20), new LoginId("bar")),
            new RecommendMessage("message20"),
            new Good(true)
          )
        ])
      );

      expect(
        await candidatesGateway.findByCandidateId(new CandidateId(0))
      ).toEqual(expected);
    });
  });
});
