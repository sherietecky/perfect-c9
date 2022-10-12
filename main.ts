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

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.get("/trydb", async (req, res) => {
  const response = await client.query(
    `select username, password from users where username=$1`,
    ["mary"]
  );
  // console.log(response.rows);
  res.json(response.rows[0]);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
