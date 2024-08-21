import { env } from "@/env.js"
// import { neon } from "@neondatabase/serverless"
// import { drizzle } from "drizzle-orm/postgres-js"
// import postgres from "postgres"

// import * as schema from "./schema"

// // import { drizzle } from 'drizzle-orm/neon-http';

// // const client = createClient({
// //   url: env.TURSO_CONNECTION_URL,
// //   authToken: env.TURSO_AUTH_TOKEN,
// // })

// // export const db = drizzle(client, { schema })
// // const sql = neon(process.env.DRIZZLE_DATABASE_URL!);


// const client = postgres(env.DATABASE_URL)
// export const db = drizzle(client, { schema })

// // todo test the  neon-http or postgres-js


// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// // const sql = neon(env.DATABASE_URL);
// const sql = neon(process.env.DATABASE_URL!);

// export const db = drizzle(sql);

 
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool)