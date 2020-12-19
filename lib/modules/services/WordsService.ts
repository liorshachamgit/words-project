import { WordsRepository } from '../repos/wordsRepository'

export class WordsService {
    private repository: WordsRepository

    constructor() {
        this.repository = new WordsRepository()
    }

    public async GetWordStatistics(id: string): Promise<number> {
        const stat = await this.repository.GetStatisticsById(id)
        return Promise.resolve(stat)
    }

    public async UpsertCollection(input: object) {
        try {
            const insertResult = await this.repository.UpsertWordInstances(input)

            return Promise.resolve(insertResult)
        }
        catch (e) {
            return Promise.reject(e)
        }
    }
}
