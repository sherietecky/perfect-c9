import { Page, chromium } from "playwright";

async function parknshopCrawler(keyword: string) {
  const browser = await chromium.launch({ headless: false });
  let page = await browser.newPage();
  let url =
    "https://www.parknshop.com/zh-hk/search?text=" +
    keyword +
    "&useDefaultSearch=false";

  await page.goto(url);
  let picDesc: string[] = [];
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(Math.random() * 10001);

    // scrap
    // 1. image
    // 2. product name
    // 3. unit
    // 5. price
    // 6. cheaper price

    let result = await page.evaluate((): any => {
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
        ".productInfo .productHighlight .ellipsis"
      );
      searchBargain.forEach((element: any) => {
        if (element.innerText === "最新推廣") {
          bargain.push("");
        } else {
          bargain.push(element.innerText);
        }
      });

      return { image, productName, productUnit, price, bargain };
    });
    console.log("result: ", result);
  }
}

parknshopCrawler("牛油果");
