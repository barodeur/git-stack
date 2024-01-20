import { Command } from "commander";
import { createDb } from "@/command/createDb";

export const removeCommand = new Command("remove")
  .alias("rm")
  .argument("<branch>")
  .argument("[parent]")
  .action(async (branch: string, parent: string | undefined) => {
    const db = createDb();

    if (parent) {
      db.query<unknown, [string, string]>(
        /* sql */ `DELETE FROM branch_dependencies WHERE branch_name = ? AND parent_branch_name = ?;`,
      ).run(branch, parent);
    } else {
      db.query<unknown, [string]>(
        /* sql */ `DELETE FROM branch_dependencies WHERE branch_name = ?`,
      ).run(branch);
    }
  });
