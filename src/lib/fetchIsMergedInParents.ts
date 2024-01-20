import type { Git } from "@/git";
import { findReachableAsync, type Graph } from "@/graph";
import { fetchIsMerged } from "./fetchIsMerged";

export async function fetchIsMergedInParents(
  git: Git,
  graph: Graph<string>,
  branch: string,
) {
  const mergedInBranch = await findReachableAsync(graph, branch, async (p) =>
    fetchIsMerged(git, branch, p),
  );
  return mergedInBranch.size > 0;
}
