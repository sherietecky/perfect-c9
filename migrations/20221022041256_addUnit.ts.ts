import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.string("quantity");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.dropColumn("quantity");
  });
}
