import dotenv from "dotenv";
import { knex } from "../../db";
import { Knex } from "knex";

export class c9Service {
  constructor(private knex: Knex) {
    this.knex=knex;
  }

    async getHomepage(){
        await this.knex.raw(`select * from price join product on price.product_id = product.id join market on price.market_id = market.id where product.product_name='${product}' order by price`)
    }

}
