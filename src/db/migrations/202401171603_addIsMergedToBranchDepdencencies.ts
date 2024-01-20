import type Database from "bun:sqlite";

export function up(db: Database) {
  db.query(
    /* sql */ `
      ALTER TABLE branch_dependencies ADD COLUMN is_merged INTEGER NOT NULL DEFAULT 0
    `,
  ).run();
}
