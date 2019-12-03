import { createTable } from "sql-query-factory";
import { UserEntity, RecommendEntity, PostgresDatabase } from "../api/driver";

async function main() {
  const db = new PostgresDatabase(process.env.DATABASE_URL);
  try {
    await db.exec(
      "DROP TABLE users;"
    );
    await db.exec(
      "DROP TABLE recommends;"
    );
    await db.exec(
      // prettier-ignore
      createTable<UserEntity>("users").ifNotExist()
        .column("id").serialForPostgres().primaryKey()
        .column("login_id").type("TEXT").notNull().unique()
        .build()
    );
    await db.exec("TRUNCATE users");
    await db.exec(
      // prettier-ignore
      createTable<RecommendEntity>("recommends").ifNotExist()
        .column("id").serialForPostgres()
        .column("candidate_id").type("INTEGER").notNull()
        .column("recommender_id").type("INTEGER").notNull()
        .column("recommend").type("TEXT").notNull()
        .column("good").type("BOOLEAN").notNull()
        .build()
    );
    await db.exec("TRUNCATE recommends");
  } finally {
    await db.dispose();
  }
}
main();
