import { Command } from "commander";
import _ from "lodash";
import { createDb } from "@/command/createDb";
import { printBoolean } from "@/helpers";
import { buildParentsGraph } from "@/lib/buildParentsGraph";
import { fetchBranchDependencies } from "@/lib/fetchBranchDependencies";
import { fetchIsMergedInParents } from "@/lib/fetchIsMergedInParents";
import { createGit } from "../createGit";

export const listCommand = new Command("list").alias("ls").action(async () => {
  const db = createDb();
  const git = createGit();

  const deps = fetchBranchDependencies(db);
  const branches = _.uniq(deps.map((d) => d.branch));
  const graph = buildParentsGraph(deps);

  console.table(
    await Promise.all(
      branches.map(async (b) => ({
        branch: b,
        merged: printBoolean(await fetchIsMergedInParents(git, graph, b)),
      })),
    ),
  );
});
