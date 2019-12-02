import { createTable } from "sql-query-factory";
import { UserEntity, RecommendEntity, PostgresDatabase } from "../api/driver";

async function main() {
  const db = new PostgresDatabase(process.env.DATABASE_URL);
  try {
    await db.exec(
      createTable<UserEntity>("users")
        .ifNotExist()
        .column("id")
        .serialForPostgres()
        .primaryKey()
        .column("login_id")
        .type("TEXT")
        .notNull()
        .unique()
        .build()
    );
    await db.exec("TRUNCATE users");
    await db.exec(
      createTable<RecommendEntity>("recommends")
        .ifNotExist()
        .column("id")
        .serialForPostgres()
        .column("candidate_id")
        .type("INTEGER")
        .column("recommender_id")
        .type("INTEGER")
        .column("recommend")
        .type("TEXT")
        .build()
    );
    await db.exec("TRUNCATE recommends");
  } finally {
    await db.dispose();
  }
}
main();
