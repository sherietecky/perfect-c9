import { Page, chromium } from "playwright";
//import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

async function scrapPakgai(keyword: string) {

  const browser = await chromium.launch({
    headless: true,
    // /home/ubuntu/chromedriver
    executablePath: '/home/ubuntu/chromedriver',
    // executablePath: '/home/ubuntu/chromedriver --whitelisted-ips=""'
    // executablePath: process.env.NODE_ENV === "production"?
    //   "/home/ubuntu/chromedriver":
    //   "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe",
    args:['--whitelisted-ips=""'],
  });
  const context = await browser.newContext({
    extraHTTPHeaders:{
      'User-Agent': 'insomnia/2022.6.0',
      'Content-Type' : "text/html; charset=UTF-8",
      'Host': 'www.parknshop.com',
      'accept' : '*/*',
      'cookie': 'ROUTE=.jsapps-555cc4b4fc-bfxm4; dtCookie=v_4_srv_32_sn_8B3745355890E62BA6D5EFD2778CBD5D_perc_100000_ol_0_mul_1_app-3A83bcd02d49cd1bb3_0; _abck=461DF9D48D0F979360F9E33FA3A6A08F~-1~YAAQhzArF9apvumDAQAAFmJ9DQjovrsgW1StaRlJydec6TiHjmlCWu333R3Se0OmewKVQjLhIsI6iuQaegK%2FROHm4ogKYhbqj9bKTcxia5J6uBP2SAgKOsFW4oLkIzg41FHBVKQeloFHxPSDgWvapmDDjntrMqXwk0%2F0OU50uoRBRP0mv%2FtQMYrHiVOvovirs5i%2FzIvBw2%2F89jHalnXEnccqEFhsnR0KkFgoFDi08gNQ9Y%2FRnMujGs7OObUJhpZUi0KX5YuqeT5F88jii154G73EHsBaduNXlwqHDLKdZKAqGFqHWDnjlvZWbKr186Es08dFWiAIpaySfXW4HQqm5gooKLzRINHVCrBGNHK1qJjv%2BQ8KE9BVFAmmaeg%3D~-1~-1~-1; ak_bmsc=3A2668186DED617D554113E79E366A12~000000000000000000000000000000~YAAQhzArF9epvumDAQAAFmJ9DRGEM0Eln7jab3MBlOkgNlUrL%2FD6rvo0uJ1so1qI5DGSZTMKdRM54RowEHSgECXRxuRtAKB3rRZpm0ya4wKFhnn%2FWxJ9lD1kpRvf7IbUAHLI5mHcdlQpswi8WIaKU8ANelv6M%2FyOjaES6HmdzsLyrLiLiV6mqrwYDzbQTHFTDssD%2FAtswX7%2BmsAbn3axaDOOpnljPKGvUc8B%2B06V34vQ80FqvZrpZpTHty6HSztn4GQIn%2Fn70PbDr5DpzE20WpfJ7T9uCe4Wi8RYjmFe8A0frivV8fWCOUkC9B0kQqMvdgLlBxC1B1%2Biy2l8QwD%2F5rdyUh2HNbrbUz77TEKGf3R9r3swNPn7mhrYz3veqzjZBNZNeReY1iXQs4encQ%3D%3D; bm_mi=18A8B624A95EA4E17A117F4100957155~YAAQhzArF%2FarvumDAQAAel9%2BDRH59YQblyauRRvGAXEUnJTGHv10sM%2FvlsjDbCB3UmyimnWr9T%2F2c03BZNpWCkBayXYK9nau28%2Fd32xTYI8apNpljOph0fnQl2pgsdmmHSx%2FVujZANE5bDjSzbkY2gplFG2lOmm9E7efW7QMHvfdAmGOA1GVUv38NqyjgaGDdNIUFwi2z52Dh%2B84qvqOy22fhZXoQDIDHl2dkWly2y2rNBG%2F2gIgo4PaX6mAblr06dIdnByALQFuCGiRPcfNpuHQMbq9moUlGzxlRM%2FMntsM%2F2o%2Fz0qye9ELjaNvTxaCFU4zuQ%2Ft2NWFgg%3D%3D~1; bm_sz=E887904C7F32720986DACBB4B50A605C~YAAQhzArF9mpvumDAQAAF2J9DRHtEp99Hp1ZYrtzA5OHV3VY0vgGL14l%2FCp6QRiIsURcyuZ5pA9mb1KxB0FZ0ze8H6nX%2FKkarL3CI16eWXSUxblzgXuxC1iGLcwOHVmG9IHYdkxBxbdaoAcX%2BGa%2FUygBBGnT29bnYjJ0QSaupT4oFV8S7L589xgULDxSJbBhaL4myUCsvAVeNGZ%2Bu06Av6lU0B1ItT1A%2Fz0F6CQc455jlIzYy2gBWEiO2pzUK2jOWhpUDyOMdtl0M%2Bzmi96XIcPTUryz54cXxXcJp2ZyyIGiVN13YHM%3D~4403506~4539186; bm_sv=63802475B307C66EDEBB41B241A4B8C8~YAAQhzArF%2FervumDAQAAel9%2BDRHWcb6M96X86Fgex7xCc0qstDXS32%2BCdRGzENN%2FlMAswcRuhVwbgse3okgJvaXI0KudbGGyG3eWwfp89m2BvPVlYH0FYXRCTOArquvXLbacdphf0Y%2Ff7%2B3tYrAfOGcFW0R1iJTQYzU3IC%2FHzZDsnZWOj0iHQSqtoEmeCfIoMRaQxH%2F2nlSMZKO30nRylrVgSrJtZ4iwIC0aiQrt0l9hC3exy2ijiZEk5OsA4ZM1UHIt~1'
    }
  });
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
