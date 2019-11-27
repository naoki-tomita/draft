import { createTable } from "sql-query-factory";
import { Database, UserEntity } from "../api/driver";

async function main() {
  const db = new Database("./data.db");
  await db.exec(
    createTable<UserEntity>("users").ifNotExist()
      .column("id").type("INTEGER").primaryKey().autoIncrement()
      .column("loginId").type("TEXT").notNull().unique().build()
  );
  await db.exec("DELETE FROM users");
  await db.exec("VACUUM");
}

main();
