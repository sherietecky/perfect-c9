import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("product").del();
  await knex("market").del();

  // Inserts seed entries
  await knex("market")
    .insert([
      { market_name: "AeonCity" },
      { market_name: "ParknShop 百佳" },
      { market_name: "HKTVMall" },
      { market_name: "Abouthai 阿布泰" },
    ])
    .returning("id");

  await knex("product")
    .insert([
      { product_name: "可口可樂" },
      { product_name: "啤酒" },
      { product_name: "寶礦力" },
      { product_name: "橙" },
      { product_name: "檸檬茶" },
      { product_name: "牛奶" },
      { product_name: "牛油果" },
      { product_name: "益力多" },
      { product_name: "維他奶" },
      { product_name: "茄子" },
      { product_name: "蘋果" },
      { product_name: "西蘭花'" },
      { product_name: "香蕉" },
    ])
    .returning("id");
}

// very scared
