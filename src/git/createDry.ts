import { create } from "./create";
import type { Git } from "./git";

export function createDry(path: string): Git {
  const _notDry = create(path);

  return {
    checkout: async (branch: string) => {
      console.log(`git checkout ${branch}`);
    },
    merge: async (branch: string, into: string) => {
      console.log(`git merge ${branch} into ${into}`);
    },
    mergeBase: _notDry.mergeBase,
    revParse: _notDry.revParse,
    createBranch: async (branch: string) => {
      console.log(`git branch create ${branch}`);
    },
  };
}
