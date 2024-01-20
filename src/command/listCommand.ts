import { Command } from "commander";
import { sources } from "@/graph";
import { buildParentsGraph } from "@/lib/buildParentsGraph";
import { fetchBranchDependencies } from "@/lib/fetchBranchDependencies";
import { createDb } from "./createDb";

export const listCommand = new Command("list")
  .alias("ls")
  .description("list stacks")
  .action(async () => {
    const db = createDb();
    const parentsGraph = buildParentsGraph(fetchBranchDependencies(db));

    console.table(
      [...sources(parentsGraph)].map((leaf) => ({
        stack: leaf,
      })),
    );
  });
