import { Page, chromium } from "playwright";
var fs = require("fs");

export async function aeoncityCrawler(category: string) {
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
    console.log(items.length);

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

    return { items, quantity, price, image };
  });

  console.log("AeonCity Search Results: ", result);
  console.log(
    result.items.length,
    result.quantity.length,
    result.price.length,
    result.image.length
  );
}

aeoncityCrawler("檸檬茶");
