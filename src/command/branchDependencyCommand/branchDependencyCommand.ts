import { Command } from "commander";
import { addCommand } from "./addCommand";
import { listCommand } from "./listCommand";
import { removeCommand } from "./removeCommand";

export const branchDependencyCommand = new Command("branch_dependency")
  .alias("dep")
  .addCommand(listCommand)
  .addCommand(addCommand)
  .addCommand(removeCommand);
