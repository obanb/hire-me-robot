import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import {createClient} from "@libsql/client";
import * as schema from './sqlite-schemas'

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})


export const db = drizzle(client, { schema,logger: true })

