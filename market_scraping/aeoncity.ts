import { Page, chromium } from "playwright";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

// async function abc() {

// async function getMarketID(knex: Knex) {
//   let resultone = await knex("market")
//     .select("id")
//     .where("market_name", "AeonCity");
//   console.log(resultone);
//   return resultone;
// }
// getMarketID(knex);

//   let two = await getMarketID(knex);
//   console.log(two);
// }
// abc();

async function main(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url =
    "https://www.aeoncity.com.hk/kh_zh/catalogsearch/result/index/?product_list_limit=100&q=" +
    keyword;

  await page.goto(url);
  await page.waitForTimeout(2000);

  let result = await page.evaluate((keyword): any => {
    let items: string[] = [];
    let searchItems = document.querySelectorAll(".product-item-link");
    searchItems.forEach((element: any) => {
      items.push(element.innerText);
    });

    let quantity: string[] = [];
    let searchQuant = document.querySelectorAll(".listing_unit_size");
    searchQuant.forEach((element: any) => {
      quantity.push(element.innerText);
    });

    let price: string[] = [];
    let searchPrice = document.querySelectorAll(
      '[data-price-type*="finalPrice"]'
    );
    searchPrice.forEach((element: any) => {
      price.push(element.innerText);
    });

    let image: string[] = [];
    let searchImage = Array.from(
      document.querySelectorAll("img.product-image-photo")
    ).map((image: any) => image.getAttribute("data-src"));
    image = searchImage;

    let link: string[] = [];
    let searchlinks = Array.from(
      document.querySelectorAll("div.product-item-photo > a")
    ).map((link: any) => link.getAttribute("href"));
    link = searchlinks;

    return { items, quantity, price, image, link, keyword };

    // let resultArr: any = [];
    // for (let i = 0; i <= items.length; i++) {
    //   resultArr.push({
    //     market: "",
    //     item: "",
    //     product: "",
    //     quantity: "",
    //     price: "",
    //     image: "",
    //     link: "",
    //   });
    //   resultArr[i].market = "AeonCity";
    //   resultArr[i].item = keyword;
    //   resultArr[i].product = items[i];
    //   resultArr[i].quantity = quantity[i];
    //   resultArr[i].price = price[i];
    //   resultArr[i].image = image[i];
    //   resultArr[i].link = link[i];
    // }

    // return { resultArr, keyword };
  }, keyword);

  let marketidNUM: number;
  let marketID = async function getMarketID(knex: Knex) {
    let result1 = await knex("market")
      .select("id")
      .where("market_name", "AeonCity");
    // console.log("marketID: ", result1);
    console.log("market id: ", result1);
    marketidNUM = result1[0].id;
    //return result1;
  };
  await marketID(knex);

  let productidNUM: number;
  let productID = async function getProductID(knex: Knex) {
    let result2 = await knex("product")
      .select("id")
      .where("product_name", result.keyword);
    console.log("product id:", result2);
    productidNUM = result2[0].id;
    // return result2;
  };
  await productID(knex);

  let finalresult = () => {
    let resultArr: any = [];
    for (let i = 0; i <= result.items.length; i++) {
      resultArr.push({
        market: "",
        item: "",
        product: "",
        quantity: "",
        price: "",
        image: "",
        link: "",
      });

      resultArr[i].market = marketidNUM;
      resultArr[i].item = productidNUM;
      resultArr[i].product = result.items[i];
      resultArr[i].quantity = result.quantity[i];
      resultArr[i].price = result.price[i];
      resultArr[i].image = result.image[i];
      resultArr[i].link = result.link[i];
    }
    console.log(resultArr);
    return resultArr;
  };
  let res = finalresult();

  // console.log("AeonCity Search Results: ", result);
  // console.log(
  //   result.items.length,
  //   result.quantity.length,
  //   result.price.length,
  //   result.image.length,
  //   result.link.length
  // );

  // convert arrays to json
  jsonfile.writeFileSync(
    path.join(__dirname, "..", "market_json", `aeon1.json`),
    res
    // result.resultArr
  );
}

main("檸檬茶");
