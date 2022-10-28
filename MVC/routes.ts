import express from "express";
import { C9Controller } from "./controller";
import { C9Service } from "./service";
import { Knex } from "knex";
import { knex } from "../db";

const c9Service = new C9Service(knex);
const c9Controller = new C9Controller(c9Service);

export const C9Routes = express.Router();

C9Routes.get("/recipes/:product", c9Controller.getProductPrice);
C9Routes.get("/marketdata/:product/:marketID", c9Controller.sortByMarket);
C9Routes.get("/recipes/:product", c9Controller.getRecipes);

// export class C9Router{
//     constructor(private c9Service:C9Service){

//     }
//     router(){
//         const router = express.Router()
//         router.get("/marketdata/:product",this.getProducts)
//         return router
//     }

//     getProducts = async (req:Express.Request,res:Express.Response)=>{

//     }
// }
