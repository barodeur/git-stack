import { Command } from "commander";
import { listCommand } from "./listCommand";

export const branchCommand = new Command("branch").addCommand(listCommand);
