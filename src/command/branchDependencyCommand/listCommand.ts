import { Command } from "commander";
import { createDb } from "@/command/createDb";
import { createGit } from "@/command/createGit";
import { buildParentsGraph } from "@/lib/buildParentsGraph";
import { fetchBranchDependencies } from "@/lib/fetchBranchDependencies";
import { fetchIsMergedInParents } from "@/lib/fetchIsMergedInParents";

export const listCommand = new Command("list")
  .alias("ls")
  .option("-o, --output <output>", "output", "table")
  .action(async ({ output }) => {
    const db = createDb();
    const git = createGit();

    const deps = fetchBranchDependencies(db);

    switch (output) {
      case "table": {
        console.table(deps);
        break;
      }
      case "mermaid": {
        const graph = buildParentsGraph(deps);
        console.log("flowchart TD;");
        for (const { branch, parent } of deps) {
          console.log(`  ${branch} --> ${parent};`);
        }
        const styled = new Set<string>();
        for (const { branch, parent } of deps) {
          const printBranchStyle = async (b: string) => {
            if (styled.has(b)) return;
            const bgColor =
              !graph.has(b) || (await fetchIsMergedInParents(git, graph, b))
                ? "green"
                : "red";
            console.log(`  style ${b} fill:${bgColor},color:white`);
            styled.add(b);
          };
          await printBranchStyle(branch);
          await printBranchStyle(parent);
        }
        break;
      }
      default:
        throw new Error(`Unknown output format: ${output}`);
    }
  });
