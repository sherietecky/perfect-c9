import { Knex } from "knex";
import jsonfile from "jsonfile";
import path from "path";

interface scrapData {
  product: string;
  quantity: string;
  price: string;
  image: string;
  link: string;
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("table_name").del();

  const result: Array<scrapData> = jsonfile.readFileSync(
    path.join(__dirname, "..", "market_json", "aeon,json")
  );

  // Inserts seed entries
  await knex("price").insert([
    { id: 1, colName: "rowValue1" },
    { id: 2, colName: "rowValue2" },
    { id: 3, colName: "rowValue3" },
  ]);
}
