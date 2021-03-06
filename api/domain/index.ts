import { UserEntity } from "../driver";

export class FCC<T> {
  values: Array<T>;
  constructor(values: Array<T>) {
    this.values = values;
  }

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[] {
    return this.values.map(callbackfn, thisArg);
  }

  find(
    predicate: (value: T, index: number, obj: T[]) => unknown,
    thisArg?: any
  ): T | undefined {
    return this.values.find(predicate, thisArg);
  }
}

export class LoginId {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

export class UserId {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}

export class User {
  id: UserId;
  loginId: LoginId;

  constructor(id: UserId, loginId: LoginId) {
    this.id = id;
    this.loginId = loginId;
  }

  static from(user: UserEntity): User {
    return new User(new UserId(user.id), new LoginId(user.login_id));
  }
}

export class Users extends FCC<User> {
  findBy(id: UserId) {
    return this.find(it => it.id.value === id.value);
  }
}

export class RecommendMessage {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

export class Recommend {
  user: User;
  message: RecommendMessage;
  good: Good;
  constructor(user: User, message: RecommendMessage, good: Good) {
    this.user = user;
    this.message = message;
    this.good = good;
  }
}

export class Recommends extends FCC<Recommend> {}

export class CandidateId {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}

export class Candidate {
  id: CandidateId;
  recommends: Recommends;
  constructor(id: CandidateId, recommends: Recommends) {
    this.id = id;
    this.recommends = recommends;
  }
}

export class Candidates extends FCC<Candidate> {}

export class Good {
  value: boolean;

  constructor(good: boolean) {
    this.value = good;
  }
}
