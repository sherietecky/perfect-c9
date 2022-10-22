import { Knex } from "knex";
import jsonfile from "jsonfile";
import path from "path";

interface PriceData {
  market_id: number;
  search_item_id: number;
  product_display_name: string;
  quantity: string;
  price: string;
  bargain: string;
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
      path.join(__dirname, "..", "market_json", "aeonAll.json")
    );
    // Inserts seed entries
    let aeonDataArr = Object.values(aeonData);
    for (let arr of aeonDataArr) {
      console.log(arr);
      let newArr: PriceData[] | any = arr;
      for (let obj of newArr) {
        await trx("price").insert({
          market_id: obj.market_id,
          product_id: obj.search_item_id,
          display_pic: obj.image,
          product_display_name: obj.product_display_name,
          quantity: obj.quantity,
          price: obj.price,
          bargain: obj.bargain,
          product_link: obj.link,
        });
      }
    }

    const pakgaiData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "pakgaiAll.json")
    );

    let pakgaiDataArr = Object.values(pakgaiData);
    for (let arr of pakgaiDataArr) {
      console.log(arr);
      let newArr: PriceData[] | any = arr;
      for (let obj of newArr) {
        await trx("price").insert({
          market_id: obj.market_id,
          product_id: obj.search_item_id,
          display_pic: obj.image,
          product_display_name: obj.product_display_name,
          quantity: obj.quantity,
          price: obj.price,
          bargain: obj.bargain,
          product_link: obj.link,
        });
      }
    }

    const hktvmallData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "hktvmallAll.json")
    );

    let hktvmallDataArr = Object.values(hktvmallData);
    for (let arr of hktvmallDataArr) {
      console.log(arr);
      let newArr: PriceData[] | any = arr;
      for (let obj of newArr) {
        await trx("price").insert({
          market_id: obj.market_id,
          product_id: obj.search_item_id,
          display_pic: obj.image,
          product_display_name: obj.product_display_name,
          quantity: obj.quantity,
          price: obj.price,
          bargain: obj.bargain,
          product_link: obj.link,
        });
      }
    }

    const abouthaiData = jsonfile.readFileSync(
      path.join(__dirname, "..", "market_json", "abouthaiAll.json")
    );

    let abouthaiDataArr = Object.values(abouthaiData);
    for (let arr of abouthaiDataArr) {
      console.log(arr);
      let newArr: PriceData[] | any = arr;
      for (let obj of newArr) {
        await trx("price").insert({
          market_id: obj.market_id,
          product_id: obj.search_item_id,
          display_pic: obj.image,
          product_display_name: obj.product_display_name,
          quantity: obj.quantity,
          price: obj.price,
          bargain: obj.bargain,
          product_link: obj.link,
        });
      }
    }

    await trx.commit();
  } catch (err: any) {
    console.error(err.message);
    await trx.rollback();
  }
}

//Scrape Done with json file
// --> import the mapped array from andrew's method
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

// original way:
// await trx("price").insert(
//   pakgaiData.map((data: any) => ({
//     market_id: data.market_id,
//     product_id: data.search_item_id,
//     display_pic: data.image,
//     product_display_name: data.product_display_name,
//     price: data.price,
//     bargain: data.bargain,
//     product_link: data.link,
//   }))
// );
