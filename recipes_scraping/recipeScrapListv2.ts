import { chromium } from "playwright";
import { basicScrap } from "../market_scraping/basicScrapFunc";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

export async function recipeScrapping(category: string) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://icook.tw/search/${category}/`, { timeout: 60000 });
  await page.waitForTimeout(4000);

  const name = await basicScrap(
    page,
    "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-content > div > h2.browse-recipe-name"
  );

  const ingredients = await basicScrap(
    page,
    "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-content > div > p.browse-recipe-content-ingredient"
  );

  let imageResult = await page.evaluate(() => {
    let image: string[] = [];
    let searchImage = Array.from(
      document.querySelectorAll(
        "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-cover > img.browse-recipe-cover-img"
      )
    ).map((image: any) => image.getAttribute("data-src"));

    for (let eachImage of searchImage) {
      image.push(eachImage);
    }
    return image;
  });

  let urlResult = await page.evaluate(() => {
    let urlsArr: string[] = [];
    let searchURL = Array.from(
      document.querySelectorAll("a.browse-recipe-link")
    ).map((url: any) => "https://icook.tw" + url.getAttribute("href"));
    for (let eachURL of searchURL) {
      urlsArr.push(eachURL);
    }
    return urlsArr;
  });

  console.log(imageResult, name, ingredients, urlResult);

  let productidNUM: number;
  let productID = async function getProductID(knex: Knex) {
    let result = await knex("product")
      .select("id")
      .where("product_name", category);
    productidNUM = result[0].id;
    console.log(productidNUM);
    // return result[0].id
  };
  await productID(knex);

  let finalresult = () => {
    let resultArr: any = [];
    for (let i = 0; i < name.length; i++) {
      resultArr.push({
        product_id: "",
        recipe_name: "",
        ingredients: "",
        image_URL: "",
        recipe_URL: "",
      });

      resultArr[i].product_id = productidNUM;
      resultArr[i].recipe_name = name[i];
      resultArr[i].ingredients = ingredients[i];
      resultArr[i].image_URL = imageResult[i];
      resultArr[i].recipe_URL = urlResult[i];
    }
    console.log(resultArr);
    return resultArr;
  };
  let res = finalresult();

  await page.waitForTimeout(4000);
  await browser.close();

  return res;
}

function autoScrap_promisfy(category: string) {
  return new Promise(async (resolve, reject) => {
    let result = await recipeScrapping(category);
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
    path.join(__dirname, "..", "recipes_json", "recipesWID.json"),
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
