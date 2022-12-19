import { Knex } from "knex";
// import { knex } from "../db";
// import dotenv from "dotenv";

export class C9Service {
  constructor(private knex: Knex) {
    this.knex = knex;
  }

  async takePic(image_filename: string) {
    let result = await fetch(
      `http://${process.env.HOST}:5000/predict?filename=${image_filename}`
    );
    let resultJson = await result.json();
    return resultJson;
  }

  // async getPic(image_filename: string) {}

  async getProductPrice(product: string) {
    const result = await this.knex.raw(
      `select * from price join product on price.product_id = product.id join market on price.market_id = market.id where product.product_name='${product}' order by price`
    );
    return result.rows;
  }

  async sortByMarket(product: string, marketID: number) {
    const result = await this.knex.raw(
      `select * from price join product on price.product_id = product.id join market on price.market_id = market.id where product.product_name='${product}' AND price.market_id=${marketID} order by price`
    );
    return result.rows;
  }

  async getRecipes(product: string) {
    const result = await this.knex.raw(
      `select * from recipe join product on recipe.product_id = product.id where product.product_name = '${product}'`
    );
    return result.rows;
  }
}
