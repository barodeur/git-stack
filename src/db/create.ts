// eslint-disable-next-line import/no-unresolved
import Database from "bun:sqlite";
import { runMigrations } from "./runMigrations";

export function create(path: string) {
  const db = new Database(path);
  runMigrations(db);
  return db;
}
