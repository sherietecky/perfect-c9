import { Page, chromium } from "playwright";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

async function scrapPakgai(keyword: string) {

  const browser = await chromium.launch({
    headless: true,
    // /home/ubuntu/chromedriver
    executablePath: '/home/ubuntu/chromedriver --whitelisted-ips=""'
    // executablePath: process.env.NODE_ENV === "production"?
    //   "/home/ubuntu/chromedriver":
    //   "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe",
  });
  const context = await browser.newContext();
  let page = await context.newPage();
  let url =
    "https://www.parknshop.com/zh-hk/search?text=" +
    keyword +
    "&useDefaultSearch=false";

  await page.goto(url, { timeout: 60000 });
  await page.waitForTimeout(2000);

  // scroll
  // let response: any;

  // for (let i = 0; i < 3; i++) {
  //   await page.mouse.wheel(0, 1000);
  //   await page.waitForTimeout(Math.random() * 10001);

  // scrap
  // 1. image
  // 2. product name
  // 3. unit
  // 5. price
  // 6. cheaper price

  let result = await page.evaluate((keyword): any => {
    let image: string[] = [];
    let serachImage = Array.from(
      document.querySelectorAll(".productImage .is-initialized > img")
    ).map((image: any) => image.getAttribute("src"));
    image = serachImage;

    let productName: string[] = [];
    let searchName = document.querySelectorAll(".productName");
    searchName.forEach((element: any) => {
      productName.push(element.innerText);
    });

    let productUnit: string[] = [];
    let searchUnit = document.querySelectorAll(".productUnit");
    searchUnit.forEach((element: any) => {
      productUnit.push(element.innerText);
    });

    let price: string[] = [];
    let searchPrice = document.querySelectorAll(".currentPrice");
    searchPrice.forEach((element: any) => {
      price.push(element.innerText);
    });

    let bargain: string[] = [];
    let searchBargain = document.querySelectorAll(
      ".productInfo .productHighlight"
    );

    searchBargain.forEach((element: any) => {
      if (!element.childNodes[0].classList) {
        bargain.push("");
        // } else if (element.innerText === "最新推廣") {
        //   bargain.push("/");
      } else if (element.childNodes[0].classList.contains("ellipsis")) {
        bargain.push(element.innerText);
      } else if (
        element.childNodes[0].classList.contains("ellipsis") &&
        element.innerText === "最新推廣"
      ) {
        bargain.push("");
      }
    });

    // searchBargain.forEach((element: any) => {
    //   if (element.innerText === "最新推廣") {
    //     bargain.push("");
    //   } else {
    //     bargain.push(element.innerText);
    //   }
    // });

    let link: string[] = [];
    let searchlinks = Array.from(
      document.querySelectorAll("a.productImage")
    ).map(
      (link: any) => "https://www.parknshop.com" + link.getAttribute("href")
    );
    link = searchlinks;

    return { image, productName, productUnit, price, bargain, link, keyword };
  }, keyword);

  // console.log(result);

  let marketidNUM: number;
  let marketID = async function getMarketID(knex: Knex) {
    let result1 = await knex("market")
      .select("id")
      .where("market_name", "ParknShop 百佳");
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
    // console.log("product id:", result2);
    productidNUM = result2[0].id;
    // return result2;
  };
  await productID(knex);

  //create json-like array
  let finalresult = () => {
    let resultArr: any = [];
    for (let i = 0; i < result.productName.length; i++) {
      resultArr.push({
        market_id: "",
        search_item_id: "",
        product_display_name: "",
        quantity: "",
        price: "",
        bargain: "",
        image: "",
        link: "",
      });

      resultArr[i].market_id = marketidNUM;
      resultArr[i].search_item_id = productidNUM;
      resultArr[i].product_display_name = result.productName[i];
      resultArr[i].quantity = result.productUnit[i];
      resultArr[i].price = result.price[i];
      resultArr[i].bargain = result.bargain[i];
      resultArr[i].image = result.image[i];
      resultArr[i].link = result.link[i];
    }
    console.log(resultArr);
    return resultArr;
  };
  let response = finalresult();

  await page.waitForTimeout(4000);
  await browser.close();

  return response;
}

function autoScrap_promisfy(keyword: string) {
  return new Promise(async (resolve, reject) => {
    let result = await scrapPakgai(keyword);
    resolve(result);
  });
}

async function autoScrap(product_list: string[]) {
  let result_arr: object[] = [];
  let result_object: any = {};
  for (let i = 0; i < product_list.length; i++) {
    console.log(i, product_list.length);
    let result: any = await autoScrap_promisfy(product_list[i]);
    // console.log(result);
    result_object[product_list[i]] = result;
    // console.log(result_all);
  }

  jsonfile.writeFileSync(
    path.join(__dirname, "..", "market_json", "pakgaiAll.json"),
    result_object,
    { flag: "w" }
  );
}

autoScrap([
  "可口可樂",
  "啤酒",
  "寶礦力",
  "橙",
  "檸檬茶",
  "牛奶",
  "牛油果",
  "益力多",
  "維他奶",
  "茄子",
  "蘋果",
  "西蘭花",
  "香蕉",
]);

// convert arrays to json
//   jsonfile.writeFileSync(
//     path.join(__dirname, "..", "market_json", "pakgai.json"),
//     response
//   );
// }

// scrapPakgai("檸檬茶");
