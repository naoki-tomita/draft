import { Database as SqliteDatabase } from "sqlite3";
import { inject } from "omusubi";
import { select } from "sql-query-factory";

export interface UserEntity {
  id: number;
  loginId: string;
}

export class Database {
  db: SqliteDatabase;
  constructor(filename: string) {
    this.db = new SqliteDatabase(filename);
  }

  async exec(sql: string) {
    return new Promise((ok, ng) => this.db.exec(sql, (err) => err ? ng(err): ok()));
  }

  async all<T>(sql: string): Promise<T[]> {
    return new Promise((ok, ng) => this.db.all(sql, (err, rows) => err ? ng(err): ok(rows)));
  }

  async get<T>(sql: string): Promise<T> {
    return new Promise((ok, ng) => this.db.get(sql, (err, raw) => err ? ng(err): ok(raw)));
  }
}

export class UsersDriver {
  @inject(Database)
  db: Database;
  async findAll(): Promise<UserEntity[]> {
    return await this.db.all<UserEntity>(
      select("*").from<UserEntity>("users").build()
    );
  }
}
