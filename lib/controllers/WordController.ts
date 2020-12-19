import { Application, Request, Response } from 'express'
import { InputParserService } from '../modules/services/InputParserService'
import { WordsService} from '../modules/services/WordsService'

export class WordController {
    private inputParserService: InputParserService
    private wordsService: WordsService

    constructor() {
        this.inputParserService = new InputParserService()
        this.wordsService = new WordsService()
    }

    public route(app: Application) {

        app.get('/api/word-statistics', async (req: Request, res: Response) => {
            if (!req.query || !req.query.word) {
                res.status(400)
                    .json({ error: "request is missing query string parameter of word" })
                    .end()
                return
            }
            const word = (req.query as any).word
            
            let statistics : number = 0 
            try {
                statistics = await this.wordsService.GetWordStatistics(word)
            } catch (e) {
                res.status(400)
                    .json({ error: e })
                    .end()
                return
            }
            res.status(200)
                .json(statistics)
                .end()
        });

        app.post('/api/word-counter', async (req: Request, res: Response) => {
            if (!req.body || !req.body.input) {
                res.status(400)
                    .json({ error: "input is missing in the reqest body" })
                    .end()
                return
            }

            const requestInput = req.body.input;
            // I'm expecting that the input field would be of type string 
            if (typeof requestInput !== 'string') {
                res.status(400)
                    .json({ error: "Bad request - input field should be a string" })
                    .end()
                return
            }
            try {
                const parsedWordObj: object = await this.inputParserService.ParseInput(requestInput)
                await this.wordsService.UpsertCollection(parsedWordObj)
                
            } catch (e) {
                res.status(400)
                    .json({ error: e })
                    .end()
                return
            }
            res.status(200)
                .json({ message: "Input request processed successfully" })
                .end()
        });
    }
}
