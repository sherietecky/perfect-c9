import express from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import { client } from "./db";

let app = express();

dotenv.config();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.get("/trydb", async (req, res) => {
  const response = await client.query(
    `select username, password from users where id=$1`,
    ["1"]
  );
  // console.log(response.rows);
  res.json(response.rows[0]);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
