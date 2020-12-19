"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordController = void 0;
const InputParserService_1 = require("../modules/services/InputParserService");
const WordsService_1 = require("../modules/services/WordsService");
class WordController {
    constructor() {
        this.inputParserService = new InputParserService_1.InputParserService();
        this.wordsService = new WordsService_1.WordsService();
    }
    route(app) {
        app.get('/api/word-statistics', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query || !req.query.word) {
                res.status(400)
                    .json({ error: "request is missing query string parameter of word" })
                    .end();
                return;
            }
            const word = req.query.word;
            let statistics = 0;
            try {
                statistics = yield this.wordsService.GetWordStatistics(word);
            }
            catch (e) {
                res.status(400)
                    .json({ error: e })
                    .end();
                return;
            }
            res.status(200)
                .json(statistics)
                .end();
        }));
        app.post('/api/word-counter', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.input) {
                res.status(400)
                    .json({ error: "input is missing in the reqest body" })
                    .end();
                return;
            }
            const requestInput = req.body.input;
            if (typeof requestInput !== 'string') {
                res.status(400)
                    .json({ error: "Bad request - input field should be a string" })
                    .end();
                return;
            }
            try {
                const parsedWordObj = yield this.inputParserService.ParseInput(requestInput);
                yield this.wordsService.UpsertCollection(parsedWordObj);
            }
            catch (e) {
                res.status(400)
                    .json({ error: e })
                    .end();
                return;
            }
            res.status(200)
                .json({ message: "Input request processed successfully" })
                .end();
        }));
    }
}
exports.WordController = WordController;
//# sourceMappingURL=WordController.js.map