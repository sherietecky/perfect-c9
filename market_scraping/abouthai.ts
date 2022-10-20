import { Page, chromium } from "playwright";
import { basicScrap } from "./basicScrapFunc";

async function abouthaiCrawler(keyword: string) {
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
}

abouthaiCrawler("蘋果");
