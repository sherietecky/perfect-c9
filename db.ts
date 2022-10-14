import { Client } from "pg";
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST
});

client.connect();

export async function initializeDB() {
  const sql = await fs.promises.readFile("./db.sql","utf8");
  await client.query(sql);
}
