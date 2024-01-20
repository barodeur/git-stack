import type { Database } from "@/bun/sqlite";
import { migrations } from "./migrations";

type MigrationName = keyof typeof migrations;

const migrationNames = Object.keys(
  migrations,
).sort() as unknown as MigrationName[];

export function runMigrations(db: Database) {
  db.query(
    /* sql */ `
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY
    )
  `,
  ).run();

  const executedMigrationNames = new Set(
    db
      .query<{ name: MigrationName }, []>(
        /* sql */ `SELECT name FROM migrations`,
      )
      .all()
      .map((row) => row.name),
  );

  for (const name of migrationNames) {
    if (executedMigrationNames.has(name)) continue;

    migrations[name].up(db);
    db.query(/* sql */ `INSERT INTO migrations(name) VALUES (?)`).run(name);
  }
}
