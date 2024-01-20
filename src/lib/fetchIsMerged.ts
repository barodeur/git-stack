import type { Git } from "@/git";

export async function fetchIsMerged(git: Git, branch: string, parent: string) {
  const [base, head] = await Promise.all([
    git.mergeBase(branch, parent),
    git.revParse(branch),
  ]);
  return base === head;
}
