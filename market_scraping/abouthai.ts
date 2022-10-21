import { Page, chromium } from "playwright";
import { basicScrap } from "./basicScrapFunc";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

async function scrapAbouthai(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url = "https://www.abouthai.com/search?keyword=" + keyword;

  await page.goto(url);
  await page.waitForTimeout(3000);

  let image = await page.evaluate(() => {
    let images: string[] = [];
    let searchlinks = Array.from(
      document.querySelectorAll("div.wares> img")
    ).map((link: any) => link.getAttribute("data-original"));
    images = searchlinks;
    return images;
  });

  let productName = await page.evaluate(() => {
    let names: string[] = [];
    let searchnames = Array.from(document.querySelectorAll("p.name > a")).map(
      (name: any) => name.getAttribute("data-name")
    );
    names = searchnames;
    return names;
  });

  const price = await basicScrap(page, "p.price .nowprice > em");

  let link = await page.evaluate(() => {
    let links: string[] = [];
    let searchlinks = Array.from(document.querySelectorAll("p.name > a")).map(
      (link: any) =>
        "https://www.abouthai.com/product/" + link.getAttribute("data-stock")
    );
    links = searchlinks;
    return links;
  });

  console.log(image, productName, price, link);

  let marketidNUM: number;
  let marketID = async function getMarketID(knex: Knex) {
    let result1 = await knex("market")
      .select("id")
      .where("market_name", "Abouthai 阿布泰");
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
      resultArr[i].image = image[i];
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
    path.join(__dirname, "..", "market_json", "abouthai.json"),
    res
    // result.resultArr
  );
}

scrapAbouthai("蘋果");
