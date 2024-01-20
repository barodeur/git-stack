import type Database from "bun:sqlite";

export function up(db: Database) {
  db.query(
    /* sql */ `
      CREATE TABLE branch_dependencies (
        branch_name TEXT,
        parent_branch_name TEXT,
        PRIMARY KEY (branch_name, parent_branch_name),
        CHECK (branch_name <> parent_branch_name)
      );
    `,
  ).run();
}
