import { Page, chromium } from "playwright";
import { basicScrap } from "./basicScrapFunc";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

async function scrapHKTVMall(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url = "https://www.hktvmall.com/hktv/zh/search_a?keyword=" + keyword;

  await page.goto(url);
  await page.waitForTimeout(3000);

  // scrap
  // 1. image
  // 2. product name
  // 3. unit
  // 5. price
  // 6. cheaper price
  // 7. product page

  let imageResult = await page.evaluate(() => {
    let image: string[] = [];
    let searchImage = Array.from(
      document.querySelectorAll("div.image-container > img")
    ).map((image: any) => image.getAttribute("src"));

    for (let eachSource of searchImage) {
      // console.log(eachSource);
      if (eachSource.includes("https:")) {
        image.push(eachSource);
      } else {
        image.push("https:" + eachSource);
      }
    }
    // image = searchImage;
    return image;
  });

  // let result = await page.evaluate(() => {
  // let productName: string[] = [];
  // let searchName = document.querySelectorAll("div.brand-product-name > h4");
  // searchName.forEach((element: any) => {
  //   productName.push(element.innerText);
  // });
  // return productName;

  const productName = await basicScrap(page, "div.brand-product-name > h4");
  const unit = await basicScrap(page, "div.packing-spec > span");
  const price = await basicScrap(page, "div.price-label .price > span");
  // const link = await basicScrap(page, "div.product-brief > a");

  let link = await page.evaluate((keyword) => {
    let links: string[] = [];
    let searchlinks = Array.from(
      document.querySelectorAll("div.product-brief > a")
    ).map((link: any) => "http://www.hktvmall.com" + link.getAttribute("href"));
    links = searchlinks;
    return links;
  });

  console.log(imageResult, productName, unit, price, link);

  let marketidNUM: number;
  let marketID = async function getMarketID(knex: Knex) {
    let result1 = await knex("market")
      .select("id")
      .where("market_name", "HKTVMall");
    // console.log("market id: ", result1);
    marketidNUM = result1[0].id;
    //return result1;
  };
  await marketID(knex);

  let productidNUM: number;
  let productID = async function getProductID(knex: Knex) {
    let result2 = await knex("product")
      .select("id")
      .where("product_name", keyword);
    // console.log("product id:", result2);
    productidNUM = result2[0].id;
    // return result2;
  };
  await productID(knex);

  let finalresult = () => {
    let resultArr: any = [];
    for (let i = 0; i < price.length; i++) {
      resultArr.push({
        market_id: "",
        search_item_id: "",
        product_display_name: "",
        quantity: "",
        price: "",
        image: "",
        link: "",
      });

      resultArr[i].market_id = marketidNUM;
      resultArr[i].search_item_id = productidNUM;
      resultArr[i].product_display_name = productName[i];
      resultArr[i].quantity = " ";
      resultArr[i].price = price[i];
      resultArr[i].image = imageResult[i];
      resultArr[i].link = link[i];
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
    path.join(__dirname, "..", "market_json", "hktvmall.json"),
    res
    // result.resultArr
  );
}

scrapHKTVMall("牛油果");
