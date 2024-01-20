import type { Database } from "@/db";

export function fetchBranchDependencies(db: Database) {
  return db
    .query<{ branch_name: string; parent_branch_name: string }, []>(
      /* sql */ `
      SELECT
        branch_name,
        parent_branch_name
      FROM branch_dependencies
      ORDER BY branch_name ASC, parent_branch_name ASC;
    `,
    )
    .all()
    .map((row) => ({
      branch: row.branch_name,
      parent: row.parent_branch_name,
    }));
}
