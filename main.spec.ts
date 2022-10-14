import { client } from "./main";
import dotenv from "dotenv";
import pg from "pg";

// describe("db", () => {
//   it("get username to be mary", async () => {
//     let result = await client.query(`select username from users where id = 1`)
//     console.log(result.rows)
//     expect(result.rows[0].username).toBe("mary")
//   });
// });

describe("sample test case", () => {
  it("should pass", async () => {
    console.log("good result");
  });
});

describe("sample DB", () => {
  it("create and drop a DB", async () => {
    client.query(`create database testing`);
    client.query(`drop database testing`);
  });

  afterAll(async () => {
    await client.end();
  });
});
