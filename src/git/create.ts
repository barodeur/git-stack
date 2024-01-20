import { simpleGit } from "simple-git";
import type { Git } from "./git";

export function create(path: string): Git {
  const _simpleGit = simpleGit({
    baseDir: path,
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: true,
  });

  return {
    checkout: async (branch: string) => {
      await _simpleGit.checkout(branch);
    },
    merge: async (branch: string, into: string) => {
      await _simpleGit.checkout(into);
      await _simpleGit.merge([branch, "--no-ff"]);
    },
    mergeBase: async (branch: string, base: string) =>
      _simpleGit.raw(["merge-base", branch, base]),
    revParse: (ref: string, options?: { abbrevRef?: boolean }) =>
      _simpleGit.revparse([
        ...(options?.abbrevRef ? ["--abbrev-ref"] : []),
        ref,
      ]),
    createBranch: async (
      branch: string,
      { startPoint }: { startPoint?: string } = {},
    ) => {
      await _simpleGit.branch([
        "-f",
        branch,
        ...(startPoint ? [startPoint] : []),
      ]);
    },
  };
}
