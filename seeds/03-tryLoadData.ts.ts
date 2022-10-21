import { Knex } from "knex";
import jsonfile from "jsonfile";
import path from "path";

interface PriceData {
  market_id: number;
  search_item_id: number;
  product_display_name: string;
  price: string;
  image: string;
  link: string;
}

export async function seed(knex: Knex): Promise<void> {
  const trx = await knex.transaction();
  try {
    // Deletes ALL existing entries
    await trx("price").del();

    // read json file
    const aeonData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "aeon.json")
    );

    // Inserts seed entries
    await trx("price").insert(
      aeonData.map((data: any) => ({
        market_id: data.market_id,
        product_id: data.search_item_id,
        display_pic: data.image,
        product_display_name: data.product_display_name,
        price: data.price,
        product_link: data.link,
      }))
    );

    const pakgaiData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "pakgai.json")
    );

    //Scrape Done! --> import the mapped array from andrew's method
    // const prices = pakgaiData.map(data=>{
    //   return {
    //     market_id: marketObject[data.market_name],
    //     product_id: productObject[data.product_name],
    //     display_pic: data.image,
    //     product_name: data.product_display_name,
    //     price: data.price,
    //     bargain: data.bargain,
    //     product_link: data.link,
    //   }
    // });

    await trx("price").insert(
      pakgaiData.map((data: any) => ({
        market_id: data.market_id,
        product_id: data.search_item_id,
        display_pic: data.image,
        product_display_name: data.product_display_name,
        price: data.price,
        bargain: data.bargain,
        product_link: data.link,
      }))
    );

    const hktvmallData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "hktvmall.json")
    );

    await trx("price").insert(
      hktvmallData.map((data: any) => ({
        market_id: data.market_id,
        product_id: data.search_item_id,
        display_pic: data.image,
        product_display_name: data.product_display_name,
        price: data.price,
        // bargain: data.bargain,
        product_link: data.link,
      }))
    );

    const abouthaiData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "abouthai.json")
    );

    await trx("price").insert(
      abouthaiData.map((data: any) => ({
        market_id: data.market_id,
        product_id: data.search_item_id,
        display_pic: data.image,
        product_display_name: data.product_display_name,
        price: data.price,
        // bargain: data.bargain,
        product_link: data.link,
      }))
    );

    await trx.commit();
  } catch (err: any) {
    console.error(err.message);
    await trx.rollback();
  }
}
