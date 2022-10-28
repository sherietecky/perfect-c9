import { Request, Response } from "express";
import { C9Service } from "./service";

export class C9Controller {
  constructor(private c9CService: C9Service) {}

  


  getProductPrice = async (req: Request, res: Response) => {
    const { product } = req.params;
    const result = await this.c9CService.getProductPrice(product);
    res.json(result.rows);
  };

  sortByMarket = async (req: Request, res: Response) => {
    const { product } = req.params;
    let marketID = parseInt(req.params.marketID);
    res.json(await this.c9CService.sortByMarket(product, marketID));
  };

  getRecipes = async (req: Request, res: Response) => {
    const { product } = req.params;
    res.json(await this.c9CService.getRecipes(product));
  };
}
