import { client, initializeDB } from "./db";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

describe("sample test case", () => {
  it("should pass", async () => {
    console.log("good result");
  });
});