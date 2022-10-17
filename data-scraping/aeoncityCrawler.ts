import { Page, chromium } from "playwright";
var fs = require("fs");
import request from "request";

async function main(category: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url =
    "https://www.aeoncity.com.hk/kh_zh/catalogsearch/result/index/?product_list_limit=100&q=" +
    category;
  type PriceList = {
    category: string;
    item: string;
    price: any;
  };

  // json file

  await page.goto(url);

  await page.waitForTimeout(2000);

  let result = await page.evaluate((): any => {
    let items: string[] = [];
    let searchItems = document.querySelectorAll(".product-item-link");
    searchItems.forEach((element: any) => {
      items.push(element.innerText);
    });
    // return items;

    let quantity: string[] = [];
    let searchQuant = document.querySelectorAll(".listing_unit_size");
    searchQuant.forEach((element: any) => {
      quantity.push(element.innerText);
    });
    // return quantity;

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

    // let print: string[]= [];

    // for (let item in items) {
    //   for (let quant in quantity) {
    //     return { item: quant };
    //   }
    //     let print:[] = []
    //     for (let i = 0; i <= items.length; i++){
    // // for (let j=0; j<= quantity.length; j++){
    //         print.push( {items[i]: quantity[i]} );
    //         return print;
    //     }
    //   });

    return { items, quantity, price, image };
  });

  console.log("AeonCity Search Results: ", result);
}

main("蘋果");
