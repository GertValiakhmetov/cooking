import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env";
import * as schema from "./schema";

// postgres.js connects lazily (on first query), so importing this module is side-effect-free
// for tests that never hit the DB.
const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export type Db = typeof db;
