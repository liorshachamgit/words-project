import { MongoClient, ObjectID } from "mongodb"


export class WordsRepository {
    private url: string = process.env.MONGO_PATH || 'mongodb://localhost:27017'
    private dbName: string = 'words-db'
    private collection: string = 'words-collection'
    private client: MongoClient;

    public GetStatisticsById(id: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true })
                const item = await this.client
                    .db(this.dbName)
                    .collection(this.collection)
                    .findOne({
                        _id: id
                    })
                const numOfOccurences: number = item
                    ? item.occurences
                    : 0
                resolve(numOfOccurences)
            } catch (error) {
                reject(error)
            }
            finally {
                this.client.close()
            }

        })
    }

    public UpsertWordInstances(words: object): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true })
                for await (const key of Object.keys(words)) {
                    const updateResult = await this.client
                        .db(this.dbName)
                        .collection(this.collection)
                        .findOneAndUpdate(
                            { _id: key },
                            {
                                $inc: { occurences: Number(words[key]) }
                            },
                            {
                                upsert: true
                            })
                }

                resolve('success')
            } catch (error) {
                reject(error)
            }
            finally {
                this.client.close()
            }
        })
    }
}
