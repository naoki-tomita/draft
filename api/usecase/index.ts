import { inject, register } from "omusubi";
import {
  UsersPort,
  UserNotFoundError,
  UserAlreadyExistError,
  CandidatesPort
} from "../port";
import {
  User,
  LoginId,
  Users,
  CandidateId,
  RecommendMessage,
  Candidate,
  Candidates,
  Good
} from "../domain";
import { UsersGateway, CandidatesGateway } from "../gateway";
import {
  UsersDriver,
  Database,
  RecommendsDriver,
  PostgresDatabase
} from "../driver";

export class UsersUsecase {
  @inject(UsersPort)
  usersPort: UsersPort;

  async create(id: LoginId): Promise<User> {
    const exist = await this.usersPort.findByLoginId(id);
    if (exist) {
      throw new UserAlreadyExistError(`user ${id.value} already exists.`);
    }
    const user = await this.usersPort.create(id);
    if (!user) {
      throw new Error("something went wrong.");
    }
    return user;
  }

  async findByLoginId(id: LoginId): Promise<User> {
    const user = await this.usersPort.findByLoginId(id);
    if (!user) {
      throw new UserNotFoundError(`user ${id.value} not found.`);
    }
    return user;
  }

  async list(): Promise<Users> {
    return await this.usersPort.list();
  }
}

export class CandidatesUsecase {
  @inject(CandidatesPort)
  candidatesPort: CandidatesPort;

  async create(
    id: CandidateId,
    recommenderId: LoginId,
    recommend: RecommendMessage,
    good: Good
  ): Promise<void> {
    return this.candidatesPort.create(id, recommenderId, recommend, good);
  }

  async findById(id: CandidateId): Promise<Candidate | null> {
    return this.candidatesPort.findByCandidateId(id);
  }

  async list(): Promise<Candidates> {
    return this.candidatesPort.list();
  }
}

function createUsecases() {
  register(new PostgresDatabase(process.env.DATABASE_URL)).as(Database);
  register(new UsersGateway()).as(UsersPort);
  register(new UsersDriver()).as(UsersDriver);
  register(new RecommendsDriver()).as(RecommendsDriver);
  register(new CandidatesGateway()).as(CandidatesPort);
  return {
    usersUsecase: new UsersUsecase(),
    candidatesUsecase: new CandidatesUsecase()
  };
}

let usecases: {
  usersUsecase: UsersUsecase;
  candidatesUsecase: CandidatesUsecase;
};

export function getUsecases() {
  return usecases ? usecases : (usecases = createUsecases());
}
