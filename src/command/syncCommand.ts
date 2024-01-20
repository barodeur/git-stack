import { Command } from "commander";
import { findReachableAsync } from "@/graph";
import { buildParentsGraph } from "@/lib/buildParentsGraph";
import { fetchBranchDependencies } from "@/lib/fetchBranchDependencies";
import { fetchIsMergedInParents } from "@/lib/fetchIsMergedInParents";
import { createDb } from "./createDb";
import { createGit } from "./createGit";

export const syncCommand = new Command("sync")
  .option("--dry", "dry run", false)
  .action(async ({ dry }) => {
    const db = createDb();
    const git = createGit({ dry });

    const initialBranch = await git.revParse("HEAD", { abbrevRef: true });
    const graph = buildParentsGraph(fetchBranchDependencies(db));

    const updatedBranches = new Set<string>();

    async function updateBranch(branch: string) {
      if (updatedBranches.has(branch)) return;
      updatedBranches.add(branch);

      if (await fetchIsMergedInParents(git, graph, branch)) {
        return;
      }

      const parents = [...(graph.get(branch) ?? [])];
      if (parents.length === 0) return;

      for (const parentBranch of parents) {
        await updateBranch(parentBranch);
      }

      const unmergedParents = [
        ...(await findReachableAsync(
          graph,
          branch,
          async (a) => !(await fetchIsMergedInParents(git, graph, a)),
        )),
      ].filter((p) => !!p) as string[];

      if (unmergedParents.length === 1) {
        const parent = unmergedParents[0];
        await git.merge(parent, branch);
      }

      if (unmergedParents.length > 1) {
        const tempBranch = `stack/${unmergedParents
          .map((b) => b.replace(/[^\w]/, "-"))
          .sort()
          .join("-")}`;
        await git.createBranch(tempBranch, { startPoint: unmergedParents[0] });
        for (const parentBranch of unmergedParents.slice(1)) {
          await git.merge(parentBranch, tempBranch);
        }
        await git.merge(tempBranch, branch);
      }
    }

    for (const branch of graph.keys()) {
      await updateBranch(branch);
    }

    await git.checkout(initialBranch);
  });
