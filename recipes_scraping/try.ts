import { Knex } from "knex";
import jsonfile from "jsonfile";
import path from "path";

// load json file
const recipeData = jsonfile.readFileSync(
  path.join(__dirname, "..", "recipes_json", "recipes.json")
);

let keysArr = Object.keys(recipeData);
console.log(keysArr);
// --> [
//   '可口可樂', '啤酒',
//   '寶礦力',   '橙',
//   '檸檬茶',   '牛奶',
//   '牛油果',   '益力多',
//   '維他奶',   '茄子',
//   '蘋果',     '西蘭花',
//   '香蕉'
// ]

let valuesArr = Object.values(recipeData);
// console.log(valuesArr);

// --> [[],[],[]]

let keysObject = Object.keys(valuesArr);
// console.log(keysObject)
// --> [
//   '0',  '1', '2',  '3',
//   '4',  '5', '6',  '7',
//   '8',  '9', '10', '11',
//   '12'
// ]

let valuesObject = Object.values(valuesArr);
console.log(valuesObject);

// if value (array of objects) belong to the key product,
// insert the key as a key:value pair to the object

// check

// match keys with product id

// async function checkProductID(key: string, knex: Knex){
//     for (let eachKey in keys){
//         if (eachKey == key){
//             let result = await knex("product")
//             .select("id")
//             .where("product_name", key)
//         }
//     }

// }

// let productidNUM: number;

// for (let key in keys){

// }

//   let productID = async function getProductID(knex: Knex) {
//     let result2 = await knex("product")
//       .select("id")
//       .where("product_name", keyword);
//     // console.log("product id:", result2);
//     productidNUM = result2[0].id;
//     // return result2;
//   };
//   await productID(knex);

// //  let recipeDataArr = Object.values(recipeData);

//   for (let arr of recipeDataArr) {
//     console.log(arr);
//     let newArr: PriceData[] | any = arr;
//     for (let obj of newArr) {
//       await trx("price").insert({
//         market_id: obj.market_id,
//         product_id: obj.search_item_id,
//         display_pic: obj.image,
//         product_display_name: obj.product_display_name,
//         quantity: obj.quantity,
//         price: obj.price,
//         bargain: obj.bargain,
//         product_link: obj.link,
//       });
//     }
//   }
