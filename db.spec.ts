import { client, initializeDB } from "./db";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

describe("sample test case", () => {
  it("should pass", async () => {
    console.log("good result");
  });
});

describe("DB", () => {
  // beforeAll(async () => {
  //   await client.query(`create table test;`);
  // });
  it("connect to DB", async () => {
    await client.query(`drop table users;`);
    await initializeDB();
  });
  afterAll(async () => {
    await client.end();
  });
});
