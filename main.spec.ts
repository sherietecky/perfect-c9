import { client } from "./main";
import dotenv from "dotenv";
import pg from "pg";

describe("db", () => {
  it("get username to be mary", async () => {
    let result = await client.query(`select username from users where id = 1`)
    console.log(result.rows)
    expect(result.rows[0].username).toBe("mary")
  });
});
