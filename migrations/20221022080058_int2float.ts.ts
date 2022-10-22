import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.dropColumn("price");
  });

  await knex.schema.alterTable("price", (table) => {
    table.float("price");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.dropColumn("price");
  });

  await knex.schema.alterTable("price", (table) => {
    table.integer("price");
  });
}
