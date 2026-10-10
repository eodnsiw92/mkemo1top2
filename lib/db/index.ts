import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { schema } from './schema'

const globalForDb = globalThis as typeof globalThis & { mkemoPool?: Pool }

const pool = globalForDb.mkemoPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

if (process.env.NODE_ENV !== 'production') globalForDb.mkemoPool = pool

export const db = drizzle(pool, { schema })
export { pool }
