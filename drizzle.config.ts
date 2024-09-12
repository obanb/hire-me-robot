import 'dotenv/config'
import type { Config } from 'drizzle-kit'

require('dotenv').config({ path: '.env.local' });

export default {
  schema: './server/sqlite-schemas.ts',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  dialect: "sqlite",
  verbose: true,
  strict: true,
} as Config
