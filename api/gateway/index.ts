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
  Candidate,
  Good
} from "../domain";
import { UsersPort, CandidatesPort } from "../port";
import { inject } from "omusubi";
import { UsersDriver, RecommendsDriver, RecommendEntity } from "../driver";

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
    const candidateArray = await this.fromEntityToCandidate(recommendsEntity);
    return new Candidates(candidateArray);
  }

  async create(
    id: CandidateId,
    recommenderId: LoginId,
    message: RecommendMessage,
    good: Good
  ): Promise<void> {
    const user = await this.usersDriver.findByLoginId(recommenderId.value);
    await this.recommendsDriver.create(
      id.value,
      user.id,
      message.value,
      good.value
    );
  }

  async findByCandidateId(id: CandidateId): Promise<Candidate | null> {
    const recommendsEntity = await this.recommendsDriver.findByCandiidateId(
      id.value
    );
    if (recommendsEntity.length === 0) {
      return null;
    }

    return (await this.fromEntityToCandidate(recommendsEntity))[0];
  }

  async fromEntityToCandidate(entities: RecommendEntity[]) {
    const usersEntity = await Promise.all(
      entities.map(it => this.usersDriver.findById(it.recommender_id))
    );
    const users = new Users(usersEntity.map(User.from));
    const recommends = entities.map(it => ({
      candidateId: it.candidate_id,
      recommend: new Recommend(
        users.findBy(new UserId(it.recommender_id)),
        new RecommendMessage(it.recommend),
        new Good(it.good)
      )
    }));
    const mappedRecommends = recommends.reduce<{ [key: number]: Recommend[] }>(
      (prev, curr) => ({
        ...prev,
        [curr.candidateId]: [...(prev[curr.candidateId] || []), curr.recommend]
      }),
      {}
    );
    return Object.keys(mappedRecommends).map(
      it =>
        new Candidate(
          new CandidateId(parseInt(it, 10)),
          new Recommends(mappedRecommends[it])
        )
    );
  }
}
