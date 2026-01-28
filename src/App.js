import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { Route } from "./Route.js";
import cors from "cors";

export default class App {
  constructor() {
    this.app = express();
    this.bodyParser = bodyParser;
  }

  route() {
    const route = new Route(this.app, this.upload);
    route.route();
  }

  init() {
    this.app.set("view engine", "ejs");
    this.app.engine("html", ejs.renderFile);
    this.app.use("/assets", express.static(this.__dirname + "/../assets"));
    this.app.use(
      this.bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.use(this.bodyParser.json());
    this.app.use(cors());
  }

  start() {
    this.init();
    this.route();
  }
}
