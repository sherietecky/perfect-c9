import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("recipe", (table) => {
    table.text("image");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("recipe", (table) => {
    table.dropColumn("image");
  });
}
