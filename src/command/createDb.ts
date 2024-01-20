import { create } from "@/db";
import { getDbPath } from "./command";

export function createDb() {
  return create(getDbPath());
}
