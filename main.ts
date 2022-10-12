import express from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

let app = express();

dotenv.config();

const client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
  return;
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
