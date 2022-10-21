import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // check before insert instead of deleting table
  async function seedRow(table: string, rowData: object) {
    let row = await knex(table).select("id").where(rowData).first();
    if (!row) {
      let rows = await knex(table).insert(rowData).returning("id");
      row = rows[0];
    }
    return row;
  }

  // Deletes ALL existing entries
  // await knex("product").del();
  // await knex("market").del();

  // Inserts seed entries

  await seedRow("market", { market_name: "AeonCity" });
  await seedRow("market", { market_name: "ParknShop 百佳" });
  await seedRow("market", { market_name: "HKTVMall" });
  await seedRow("market", { market_name: "Abouthai 阿布泰" });

  await seedRow("product", { product_name: "可口可樂" });
  await seedRow("product", { product_name: "啤酒" });
  await seedRow("product", { product_name: "寶礦力" });
  await seedRow("product", { product_name: "橙" });
  await seedRow("product", { product_name: "檸檬茶" });
  await seedRow("product", { product_name: "牛奶" });
  await seedRow("product", { product_name: "牛油果" });
  await seedRow("product", { product_name: "益力多" });
  await seedRow("product", { product_name: "維他奶" });
  await seedRow("product", { product_name: "茄子" });
  await seedRow("product", { product_name: "蘋果" });
  await seedRow("product", { product_name: "西蘭花" });
  await seedRow("product", { product_name: "香蕉" });

  // await knex("market").insert([
  //   { id: 1, market_name: "AeonCity" },
  //   { id: 2, market_name: "ParknShop 百佳" },
  //   { id: 3, market_name: "HKTVMall" },
  //   { id: 4, market_name: "Abouthai 阿布泰" },
  // ]);
  // .returning("id");

  // await knex("product").insert([
  //   { id: 1, product_name: "可口可樂" },
  //   { id: 2, product_name: "啤酒" },
  //   { id: 3, product_name: "寶礦力" },
  //   { id: 4, product_name: "橙" },
  //   { id: 5, product_name: "檸檬茶" },
  //   { id: 6, product_name: "牛奶" },
  //   { id: 7, product_name: "牛油果" },
  //   { id: 8, product_name: "益力多" },
  //   { id: 9, product_name: "維他奶" },
  //   { id: 10, product_name: "茄子" },
  //   { id: 11, product_name: "蘋果" },
  //   { id: 12, product_name: "西蘭花'" },
  //   { id: 13, product_name: "香蕉" },
  // ]);
  // .returning("id");
}
