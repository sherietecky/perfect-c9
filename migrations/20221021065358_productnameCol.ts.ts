import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.renameColumn("product_name", "product_display_name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.renameColumn("product_display_name", "product_name");
  });
}
