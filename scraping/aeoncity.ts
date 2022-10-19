import { Page, chromium } from "playwright";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";

// interface PriceList {
//   product_name: string;
//   unit: string;
//   price: string;
//   image: string;
//   link: string;
// }

async function main(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url =
    "https://www.aeoncity.com.hk/kh_zh/catalogsearch/result/index/?product_list_limit=100&q=" +
    keyword;

  await page.goto(url);
  await page.waitForTimeout(2000);

  let result = await page.evaluate((): any => {
    // let result: Array<PriceList> = [];
    // let result: [] = [];

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

    // return { items, quantity, price, image, link };
    let resultArr: any = [];
    for (let i = 0; i <= items.length; i++) {
      resultArr.push({
        product: "",
        quantity: "",
        price: "",
        image: "",
        link: "",
      });
      resultArr[i].product = items[i];
      resultArr[i].quantity = quantity[i];
      resultArr[i].price = price[i];
      resultArr[i].image = image[i];
      resultArr[i].link = link[i];
    }

    return resultArr;
  });

  // console.log("AeonCity Search Results: ", result);
  // console.log(
  //   result.items.length,
  //   result.quantity.length,
  //   result.price.length,
  //   result.image.length,
  //   result.link.length
  // );

  // convert arrays to json
  jsonfile.writeFileSync(path.join(__dirname, "aeon.json"), result);
}

main("檸檬茶");
