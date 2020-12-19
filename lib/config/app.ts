import * as express from "express"
import * as bodyParser from "body-parser"

import { WordController } from "../controllers/WordController"
import { CommonController } from "../controllers/CommonController"

class App {
    public app: express.Application

    private commonRoutes: CommonController = new CommonController()
    private wordRoutes: WordController = new WordController()

    constructor() {
        this.app = express()
        this.config()
        this.registerRoutes(this.app)
        // default route to catch unhandled URLs- it should always registerd last
        this.commonRoutes.route(this.app)
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json())
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }))
    }

    private registerRoutes(app:express.Application): void {
        this.wordRoutes.route(app)
        
    }
}

export default new App().app
