"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const WordController_1 = require("../controllers/WordController");
const CommonController_1 = require("../controllers/CommonController");
class App {
    constructor() {
        this.commonRoutes = new CommonController_1.CommonController();
        this.wordRoutes = new WordController_1.WordController();
        this.app = express();
        this.config();
        this.registerRoutes(this.app);
        this.commonRoutes.route(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    registerRoutes(app) {
        this.wordRoutes.route(app);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map