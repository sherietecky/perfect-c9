import { chromium } from "playwright";
import { readJsonConfigFile } from "typescript";
import fs from "fs";
import jsonfile from "jsonfile";
import path from "path";

export async function recipeScrapping(category: string) {
  const browser = await chromium.launch({
    headless: false,
    channel: "msedge",
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`https://icook.tw/search/${category}/`);

  await page.waitForTimeout(4000);

  const result = await page.evaluate(() => {
    let recipes_object: {
      [T: string]: string[] | number;
    } = {};

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
        name: recipes_object["names"][i],
        ingredient: recipes_object["ingredients"][i],
        image: recipes_object["images"][i],
        urls: recipes_object["urls"][i],
      });
      //   console.log(recipes_object["names"][i]);
    }

    return recipesByItems;
  });
  console.log(result);
  console.log(JSON.stringify(result));
  await page.waitForTimeout(4000);
  await browser.close();
  // let result_json = JSON.stringify(result);

  jsonfile.writeFileSync(
    path.join(__dirname, "..", "recipes_json", "recipes.json"),
    result
  );

  //   fs.writeFileSync(path.join(__dirname, "jsonData", "aeon.json"), result_json);
  //   return JSON.stringify(result);
}

recipeScrapping("蘋果");
