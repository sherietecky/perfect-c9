import { Request, Response } from "express";
import { C9Service } from "./service";
import path from "path";
import formidable from "formidable";

export class C9Controller {
  constructor(private c9CService: C9Service) {}

  toHome = (req: Request, res: Response) => {
    res.sendFile(path.resolve("public", "index.html"));
  };

  predict = (req: Request, res: Response) => {
  };

  // getPredictImage = (req: Request, res: Response) => {
  //   const { img } = req.params;
  //   res.sendFile(path.resolve("predict_images", img));
  // };

  snap = async (req: Request, res: Response) => {
    let image_filename: string = "";
    const uploadDir = "predict_images";
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10000 * 1024 ** 2, // the default limit is 10MB
      filter: (part) => part.mimetype?.startsWith("image/") || false,
    });

    form.parse(req, async (err, fields, files) => {
      let image = files.predict_image;
      let imageFile = Array.isArray(image) ? image[0] : image;
      image_filename = imageFile ? imageFile.newFilename : "";
    });

    const result = await this.c9CService.takePic(image_filename);
    res.json(result.rows);
  };

  getResultImage = async (req: Request, res: Response) => {
    let image_filename: string = "";
    res.json(image_filename);
  };

  getProductPrice = async (req: Request, res: Response) => {
    const { product } = req.params;
    const result = await this.c9CService.getProductPrice(product);
    res.json(result);
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
