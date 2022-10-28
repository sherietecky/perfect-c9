import { C9Controller } from "./MVC/controller";
import { C9Service } from "./MVC/service";
import { C9Routes } from "./MVC/routes";
import { knex } from "./db";
import express from "express";

let app = express();

const c9Service = new C9Service(knex);
export const c9Controller = new C9Controller(c9Service);

app.use("/", C9Routes);
app.use(express.static('public'));

app.listen(4000, () => {
  console.log("listening on port 4000");
});
