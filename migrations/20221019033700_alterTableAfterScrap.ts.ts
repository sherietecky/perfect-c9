import { table } from "console";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("price", (table) => {
         table.string("product_name");
         table.string("bargain");
         table.string("product_link");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("price", (table) => {
        table.dropColumn("product_name");
        table.dropColumn("bargain");
        table.dropColumn("product_link");
    });
}

