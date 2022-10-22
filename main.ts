import express from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
// import { client } from "./db";
import formidable from "formidable";
// import expressSession from 'express-session'
import { knex } from "./db";
import { Knex } from "knex";

let app = express();

dotenv.config();

app.use(express.static("public"));
app.use(express.static("predict_images"));

// app.use(
//   expressSession({
//     secret: 'Tecky Academy teaches typescript',
//     resave: true,
//     saveUninitialized: true,
//   }),
// )

// declare module 'express-session' {
//   interface SessionData {
//     name?: string
//   }
// }

// app.get('/session', (req, res) => {
//   req.session.name = 'Tecky Academy'
//   console.log(req.session)
//   res.write(req.session.name)
// })

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

// app.get("/trydb", async (req, res) => {
//   const response = await client.query(
//     `select username, password from users where id=$1`,
//     ["1"]
//   );
//   res.json(response.rows[0]);
// });

// get the snap photo
const uploadDir = "predict_images";
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 10000 * 1024 ** 2, // the default limit is 10MB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

app.post("/snap", (req, res) => {
  console.log("you can connect to main.ts");

  form.parse(req, async (err, fields, files) => {
    let image = files.predict_image;
    let imageFile = Array.isArray(image) ? image[0] : image;
    let image_filename = imageFile ? imageFile.newFilename : "";
    try {
      let result = await fetch(
        `http://${process.env.HOST}:8000/predict?filename=${image_filename}`
      );
      let output = await result.json();
      res.json(output);
    } catch (error) {
      res.end("cannot connect to DB");
    }
  });
});

app.get("/marketdata", async (req, res) => {
  const { product } = req.query;
  try {
    const response = await knex.raw(
      `select * from price join product on price.product_id = product.id join market on price.market_id = market.id where product.product_name='${product}'`
    );
    // order by price
    res.json(response.rows);
    // console.log(response.rows);
    return;
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
