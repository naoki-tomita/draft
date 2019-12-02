import {
  User,
  Users,
  LoginId,
  Recommends,
  CandidateId,
  RecommendMessage,
  Recommend,
  UserId,
  Candidates,
  Candidate
} from "../domain";
import { UsersPort, CandidatesPort } from "../port";
import { inject } from "omusubi";
import { UsersDriver, RecommendsDriver } from "../driver";
import { number } from "prop-types";

export class UsersGateway extends UsersPort {
  @inject(UsersDriver)
  usersDriver: UsersDriver;

  async list(): Promise<Users> {
    const users = await this.usersDriver.findAll();
    return new Users(users.map(User.from));
  }

  async create(id: LoginId): Promise<User> {
    await this.usersDriver.create(id.value);
    return User.from(await this.usersDriver.findByLoginId(id.value));
  }

  async findByLoginId(id: LoginId): Promise<User | null> {
    const user = await this.usersDriver.findByLoginId(id.value);
    return user && User.from(user);
  }
}

export class CandidatesGateway extends CandidatesPort {
  @inject(UsersDriver)
  usersDriver: UsersDriver;

  @inject(RecommendsDriver)
  recommendsDriver: RecommendsDriver;

  async list(): Promise<Candidates> {
    const recommendsEntity = await this.recommendsDriver.findAll();
    const usersEntity = await Promise.all(
      recommendsEntity.map(it => this.usersDriver.findById(it.recommenderId))
    );
    const users = new Users(usersEntity.map(User.from));
    const recommends = recommendsEntity.map(it => ({
      candidateId: it.candidateId,
      recommend: new Recommend(
        users.findBy(new UserId(it.recommenderId)),
        new RecommendMessage(it.recommend)
      )
    }));
    const mappedRecommends = recommends.reduce<{ [key: number]: Recommend[] }>(
      (prev, curr) => {
        if (prev[curr.candidateId] == null) {
          prev[curr.candidateId] = [];
        }
        prev[curr.candidateId].push(curr.recommend);
        return prev;
      },
      {}
    );
    const candidateArray = Object.keys(mappedRecommends).map(
      it =>
        new Candidate(
          new CandidateId(parseInt(it, 10)),
          new Recommends(mappedRecommends[it])
        )
    );
    return new Candidates(candidateArray);
  }

  async create(
    id: CandidateId,
    recommenderId: LoginId,
    message: RecommendMessage
  ): Promise<void> {
    const user = await this.usersDriver.findByLoginId(recommenderId.value);
    await this.recommendsDriver.create(id.value, user.id, message.value);
  }

  async findById(id: CandidateId): Promise<Candidate> {
    throw "not impl";
  }
}
