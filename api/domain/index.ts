import { UserEntity } from "../driver";

export class FCC<T> {
  values: Array<T>;
  constructor(values: Array<T>) {
    this.values = values;
  }
}

export class LoginId {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

export class User {
  id: LoginId;

  constructor(id: LoginId) {
    this.id = id;
  }

  static from(user: UserEntity): User {
    return new User(new LoginId(user.loginId));
  }
}

export class Users extends FCC<User> {
  constructor(values: Array<User>) {
    super(values);
  }
}
