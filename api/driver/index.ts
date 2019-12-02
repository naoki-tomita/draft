//import { SqliteClient as SqliteClient } from "sqlite3";
import { Client as PostgresClient } from "pg";
import { inject } from "omusubi";
import { select, insertInto } from "sql-query-factory";

export abstract class Database {
  abstract exec(sql: string): Promise<void>;
  abstract all<T>(sql: string): Promise<T[]>;
  abstract get<T>(sql: string): Promise<T | null>;
}

// export class SqliteDatabase implements Database {
//   db: SqliteClient;
//   constructor(filename: string) {
//     this.db = new SqliteClient(filename);
//   }

//   async exec(sql: string): Promise<void> {
//     return new Promise((ok, ng) => this.db.exec(sql, (err) => err ? ng(err): ok()));
//   }

//   async all<T>(sql: string): Promise<T[]> {
//     return new Promise((ok, ng) => this.db.all(sql, (err, rows) => err ? ng(err): ok(rows)));
//   }

//   async get<T>(sql: string): Promise<T | null> {
//     return new Promise((ok, ng) => this.db.get(sql, (err, raw) => err ? ng(err): ok(raw)));
//   }
// }

export class PostgresDatabase implements Database {
  db: PostgresClient;
  connected: Promise<void>;
  constructor(connectionString: string) {
    this.db = new PostgresClient({ connectionString: connectionString });
    this.connected = this.db.connect();
  }

  async exec(sql: string): Promise<void> {
    await this.connected;
    await this.db.query(sql);
  }

  async all<T>(sql: string): Promise<T[]> {
    await this.connected;
    const result = await this.db.query<T>(sql);
    return result.rows;
  }

  async get<T>(sql: string): Promise<T | null> {
    await this.connected;
    const result = await this.db.query<T>(sql);
    return result.rows[0] || null;
  }
}

export interface UserEntity {
  id: number;
  loginId: string;
}

export class UsersDriver {
  @inject(Database)
  db: Database;
  async findAll(): Promise<UserEntity[]> {
    return await this.db.all<UserEntity>(
      select("*")
        .from<UserEntity>("users")
        .build()
    );
  }

  async create(id: string) {
    await this.db.exec(
      insertInto<UserEntity>("users")
        .keys("loginId")
        .values(id)
        .build()
    );
  }

  async findByLoginId(loginId: string): Promise<UserEntity | null> {
    return await this.db.get(
      select("*")
        .from<UserEntity>("users")
        .where("loginId")
        .equal(loginId)
        .build()
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.db.get(
      select("*")
        .from<UserEntity>("users")
        .where("id")
        .equal(id)
        .build()
    );
  }
}

export interface RecommendEntity {
  id: number;
  candidateId: number;
  recommenderId: number;
  recommend: string;
}

export class RecommendsDriver {
  @inject(Database)
  db: Database;
  async findAll(): Promise<RecommendEntity[]> {
    return await this.db.all<RecommendEntity>(
      select("*")
        .from<RecommendEntity>("recommends")
        .build()
    );
  }

  async create(candidateId: number, recommenderId: number, recommend: string) {
    await this.db.exec(
      insertInto<RecommendEntity>("recommends")
        .keys("candidateId", "recommenderId", "recommend")
        .values(candidateId, recommenderId, recommend)
        .build()
    );
  }

  async findById(candidateId: string): Promise<RecommendEntity | null> {
    return await this.db.get(
      select("*")
        .from<RecommendEntity>("recommends")
        .where("candidateId")
        .equal(candidateId)
        .build()
    );
  }
}
