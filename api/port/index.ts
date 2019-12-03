import {
  Users,
  User,
  LoginId,
  CandidateId,
  Recommends,
  RecommendMessage,
  Candidates,
  Candidate,
  Good
} from "../domain";

export abstract class UsersPort {
  abstract async list(): Promise<Users>;
  abstract async create(id: LoginId): Promise<User>;
  abstract async findByLoginId(id: LoginId): Promise<User | null>;
}

export abstract class CandidatesPort {
  abstract async list(): Promise<Candidates>;
  abstract async create(
    id: CandidateId,
    recommenderId: LoginId,
    message: RecommendMessage,
    good: Good
  ): Promise<void>;
  abstract async findByCandidateId(id: CandidateId): Promise<Candidate | null>;
}

export class UserNotFoundError extends Error {}
export class UserAlreadyExistError extends Error {}
