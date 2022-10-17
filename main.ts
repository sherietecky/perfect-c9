import express from "express";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import { client } from "./db";
import formidable from "formidable";

let app = express();

dotenv.config();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.get("/trydb", async (req, res) => {
  const response = await client.query(
    `select username, password from users where id=$1`,
    ["1"]
  );
  console.log(response.rows);
  res.json(response.rows[0]);
});

// get the snap photo
const uploadDir = "snap";
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 10000 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

app.post("/post", (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      // error
      return;
    }
    let image = files.request_image;
    let imageFile = Array.isArray(image) ? image[0] : image;
    let image_filename = imageFile ? imageFile.newFilename : "";

    let sql = `INSERT INTO "request" (`;

    let result = await client.query(sql);
    // console.log("job posted, job no:", result.rows[0].id);
    res.status(200);
  });
});

//




app.listen(3000, () => {
  console.log("listening on port 3000");
});
