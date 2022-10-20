import { chromium } from "playwright";

let recipes: {
  [T: string]: string[];
} = {};

export async function recipeScrapping(category: string) {
  let recipes: {
    [T: string]: string[];
  } = {};

  const browser = await chromium.launch({
    headless: false,
    channel: "msedge",
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://icook.tw/");

  await page.waitForTimeout(1000);

  await page.locator("input.search-input").fill(category);

  await page.waitForTimeout(1000);
  //   await page.click("input[class=btn_search-product]:visible");
  //   await page.goto("https://www.google.com");
  //   await page.type("input[name=q]", "蘋果食譜");
  //   await page.click("input[name=btnK]:visible");
  await page.locator("button.btn-search").click();
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(2000);
  await page.click(
    ".result-browse-layout.bottom-sticky-ad-waypoint--in > li:nth-child(3) > a"
  );
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    // let recipe: {
    //   name: string;
    //   servings: string;
    //   time: string;
    // }
    let recipe = {
      name: "",
      servings: "",
      time: "",
      ingredients: {},
    };
    let title: any = document.querySelector("h1#recipe-name.title");
    // title = title!.replace(/[\r\n]/gm, "");
    recipe["name"] = title.innerText;

    let servings: any = document.querySelector(
      "div.servings-info.info-block > .info-content > .servings > .num"
    );
    recipe["servings"] = servings.innerText;

    let time: any = document.querySelector(
      "div.time-info.info-block > .info-content > .num"
    );
    recipe["time"] = time.innerText;

    let ingredients: any = document.querySelectorAll(
      "div.group > div.group-name"
    );
    let ingredients_list: any[] = [];
    ingredients.forEach((element: any) => {
      ingredients_list.push(element.innerText);

      recipe["ingredients"] = ingredients_list;
    });

    return recipe;
    // return searchItem;
    // return recipes;
  });
  console.log(result);
}
recipeScrapping("蘋果");
