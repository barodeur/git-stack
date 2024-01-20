import { Command } from "commander";
import { createDb } from "@/command/createDb";
import type { SQLiteError } from "@/db";

export const addCommand = new Command("add")
  .argument("<branch>")
  .argument("<parent>")
  .action(async (branch, parent) => {
    const db = createDb();
    try {
      db.query(
        /* sql */ `INSERT INTO branch_dependencies(branch_name, parent_branch_name) VALUES (?, ?);`,
      ).run(branch, parent);
    } catch (error: unknown) {
      if (typeof error === "object") {
        const errorObject = error as { name?: string };
        if (errorObject.name === "SQLiteError") {
          const sqliteError = error as SQLiteError;
          if (sqliteError.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            console.log("Branch dependency already exists");
            return;
          }
        }
      }

      throw error;
    }
  });
