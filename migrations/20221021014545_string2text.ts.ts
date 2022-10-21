import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.dropColumn("product_link");
    table.dropColumn("display_pic");
  });

  await knex.schema.alterTable("price", (table) => {
    table.text("product_link");
    table.text("display_pic");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.dropColumn("product_link");
    table.dropColumn("display_pic");
  });

  await knex.schema.alterTable("price", (table) => {
    table.string("product_link");
    table.string("display_pic");
  });
}
