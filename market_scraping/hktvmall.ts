import { Page, chromium } from "playwright";
import { basicScrap } from "./basicScrapFunc";

async function HKTVMallCrawler(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url = "https://www.hktvmall.com/hktv/zh/search_a?keyword=" + keyword;

  await page.goto(url);
  await page.waitForTimeout(2000);

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

  let link = await page.evaluate(() => {
    let links: string[] = [];
    let searchlinks = Array.from(
      document.querySelectorAll("div.product-brief > a")
    ).map((link: any) => "http://www.hktvmall.com" + link.getAttribute("href"));
    links = searchlinks;
    return links;
  });

  console.log(imageResult, productName, unit, price, link);
}

HKTVMallCrawler("牛油果");