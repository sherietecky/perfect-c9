import { Knex } from "knex";
import jsonfile from "jsonfile";
import path from "path";

interface RecipeData {
  product_id: number;
  recipe_name: string;
  ingredients: string;
  image: string;
  link: string;
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("recipe").del();

  //load json data
  const recipeData = jsonfile.readFileSync(
    path.join(__dirname, "..", "recipes_json", "recipesWID.json")
  );
  // Inserts seed entries
  let recipeDataArr = Object.values(recipeData);
  for (let arr of recipeDataArr) {
    console.log(arr);
    let newArr: RecipeData[] | any = arr;
    for (let obj of newArr) {
      await knex("recipe").insert({
        product_id: obj.product_id,
        recipe_name: obj.recipe_name,
        ingredients: obj.ingredients,
        image: obj.image,
        url: obj.link,
      });
    }
  }
}
