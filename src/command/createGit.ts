import { create, createDry } from "@/git";
import { getGitRepoPath } from "./command";

export function createGit({ dry = false }: { dry?: boolean } = {}) {
  const path = getGitRepoPath();
  return dry ? createDry(path) : create(path);
}
