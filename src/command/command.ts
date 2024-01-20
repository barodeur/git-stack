import { Command } from "commander";
import { version } from "@/version";
import { branchCommand } from "./branchCommand";
import { branchDependencyCommand } from "./branchDependencyCommand";
import { listCommand } from "./listCommand";
import { syncCommand } from "./syncCommand";

export const command = new Command()
  .version(version)
  .option("--git-repo <path>", "path to git repo", process.cwd())
  .option("--db <path>", "path to db", "gitstack.sqlite")
  .option("--github-token <token>", "github token")
  .addCommand(listCommand)
  .addCommand(syncCommand)
  .addCommand(branchCommand)
  .addCommand(branchDependencyCommand);

export const getDbPath = () => command.getOptionValue("db") as string;
export const getGitRepoPath = () => command.getOptionValue("gitRepo") as string;
export const getGithubToken = () =>
  (command.getOptionValue("githubToken") || process.env.GITHUB_TOKEN) as
    | string
    | undefined;
