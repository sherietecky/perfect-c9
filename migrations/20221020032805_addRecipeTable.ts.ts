import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("recipe", (table) => {
    table.increments("id");
    table.integer("product_id").unsigned().references("product.id");
    table.string("recipe_name");
    table.string("ingredients");
    table.string("url");
  });

  await knex.schema.alterTable("price", (table) => {
    table.string("bargain").alter().defaultTo(" ");
    table.dropColumn("scrapped_date");
    // table.timestamp("scrapped_date");
  });

  await knex.schema.alterTable("price", (table) => {
    table.timestamp("scrapped_date");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("price", (table) => {
    table.string("bargain").notNullable().defaultTo("").alter();
    table.dropColumn("scrapped_date");
  });

  await knex.schema.alterTable("price", (table) => {
    table.date("scrapped_date");
  });

  await knex.schema.dropTableIfExists("recipe");
}
