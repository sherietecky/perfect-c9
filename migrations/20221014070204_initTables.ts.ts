import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username").notNullable();
    table.string("password").notNullable();
  });

  await knex.schema.createTable("upload_pic", (table) => {
    table.increments("id");
    table.integer("user").unsigned();
    table.foreign("user").references("users.id");
    table.string("filename");
    table.string("result_product");
  });

  await knex.schema.createTable("product", (table) => {
    table.increments("id");
    table.string("product_name");
  });

  await knex.schema.createTable("market", (table) => {
    table.increments("id");
    table.string("market_name");
  });

  await knex.schema.createTable("price", (table) => {
    table.increments("id");
    table.integer("market_id").unsigned().references("market.id");
    table.integer("product_id").unsigned().references("product.id");
    table.integer("price");
    table.date("scrapped_date");
    table.string("display_pic");
  });

  await knex.schema.createTable("browse_history", (table) => {
    table.increments("id");
    table.integer("user").unsigned();
    table.foreign("user").references("users.id");
    table.integer("product").unsigned();
    table.foreign("product").references("product.id");
    table.date("browsed_date");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("browse_history");
  await knex.schema.dropTableIfExists("price");
  await knex.schema.dropTableIfExists("market");
  await knex.schema.dropTableIfExists("product");
  await knex.schema.dropTableIfExists("upload_pic");
  await knex.schema.dropTableIfExists("users");
}
