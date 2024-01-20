import type { Graph } from "@/graph";

export function buildParentsGraph(
  branchDependencies: Array<{ branch: string; parent: string }>,
): Graph<string> {
  const parents = new Map<string, Set<string>>();
  for (const { parent, branch } of branchDependencies) {
    if (!parents.has(branch)) {
      parents.set(branch, new Set());
    }
    parents.get(branch)?.add(parent);
  }

  return parents;
}
