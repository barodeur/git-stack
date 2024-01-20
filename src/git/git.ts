export type Git = {
  checkout: (branch: string) => Promise<void>;
  merge: (branch: string, into: string) => Promise<void>;
  mergeBase: (branch: string, base: string) => Promise<string>;
  revParse: (ref: string, options?: { abbrevRef?: boolean }) => Promise<string>;
  createBranch: (
    branch: string,
    options?: { startPoint?: string },
  ) => Promise<void>;
};
