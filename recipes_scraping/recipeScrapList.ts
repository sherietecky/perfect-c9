import { chromium } from "playwright";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";
import { knex } from "../db";
import { Knex } from "knex";

// let productidNUM: number;
export async function recipeScrapping(category: string) {
  const browser = await chromium.launch({
    headless: false,
    // channel: "msedge",
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`https://icook.tw/search/${category}/`);

  await page.waitForTimeout(4000);

  const result = await page.evaluate((category) => {
    let recipes_object: {
      [T: string]: string[] | number;
    } = {};

    //  let productidNUM: number;
    // let productID = async function getProductID(knex: Knex) {
    //   let result = await knex("product")
    //     .select("id")
    //     .where("product_name", category);
    //   productidNUM = result[0].id;
    //   // return result[0].id
    // };
    // productID(knex);

    //===================================================================================================

    let names: any = document.querySelectorAll(
      "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-content > div > h2.browse-recipe-name"
    );
    let ingredients: any = document.querySelectorAll(
      "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-content > div > p.browse-recipe-content-ingredient"
    );
    let images: any = document.querySelectorAll(
      "a.browse-recipe-link > article.browse-recipe-card > div.browse-recipe-cover > img.browse-recipe-cover-img"
    );
    let urls: any = document.querySelectorAll("a.browse-recipe-link");
    // let resultArr: any = [];
    // for (let i = 0; i < urls.length; i++) {
    //   resultArr.push({
    //     names: "",
    //     ingredients: "",
    //     images: "",
    //     urls: "",
    //   });
    //   resultArr[i].names = names[i].innerText;
    //   resultArr[i].ingredients = ingredients[i].innerText;
    //   resultArr[i].images = images[i].getAttribute("data-src");
    //   resultArr[i].urls = `https://icook.tw${urls[i].getAttribute("href")}`;
    // }
    let nameList: any[] = [];
    names.forEach((element: any) => {
      nameList.push(element.innerText);
    });
    recipes_object["names"] = nameList;

    //===================================================================================================

    let ingredientsList: any[] = [];
    ingredients.forEach((element: any) => {
      ingredientsList.push(element.innerText);
    });
    recipes_object["ingredients"] = ingredientsList;

    //===================================================================================================

    let image_list: any[] = [];
    images.forEach((element: any) => {
      image_list.push(element.getAttribute("data-src"));
    });
    recipes_object["images"] = image_list;

    //===================================================================================================

    let url_list: any[] = [];
    urls.forEach((element: any) => {
      url_list.push(`https://icook.tw${element.getAttribute("href")}`);
    });
    recipes_object["urls"] = url_list;

    //===================================================================================================

    recipes_object["names_length"] = nameList.length;
    recipes_object["ingredients_length"] = ingredientsList.length;
    recipes_object["images_length"] = image_list.length;
    recipes_object["urls_length"] = url_list.length;

    //===================================================================================================
    // return recipes_object;
    let recipesByItems: any[] = [];

    for (let i = 0; i < recipes_object["names_length"]; i++) {
      //   recipesByItems.push({
      //     names: {},
      //     ingredients: {},
      //     images: {},
      //     urls: {},
      //   });

      recipesByItems.push({
        // product_id: productidNUM,
        name: recipes_object["names"][i],
        ingredient: recipes_object["ingredients"][i],
        image: recipes_object["images"][i],
        urls: recipes_object["urls"][i],
      });
      //   console.log(recipes_object["names"][i]);
    }

    return recipesByItems;
  }, category);
  await page.waitForTimeout(2000);
  await browser.close();

  return result;
  // console.log(JSON.stringify(result));
  // let result_json = JSON.stringify(result);

  //   fs.writeFileSync(path.join(__dirname, "jsonData", "aeon.json"), result_json);
  //   return JSON.stringify(result);
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
// recipeScrapping("蘋果");
// recipeScrapping("可樂");
// recipeScrapping("牛奶");
