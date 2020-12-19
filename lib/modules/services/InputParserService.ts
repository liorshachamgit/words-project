import * as path from "path";
import * as fs from "fs";
import * as readline from "readline"
import Axios, * as axios from "axios";

export class InputParserService {

    private urlRegex: RegExp

    constructor() {
        this.urlRegex = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})')
    }

    public async ParseInput(input: string): Promise<object> {
        if (!input || typeof input !== 'string') {
            return Promise.reject('bad input')
        }
        const groupedInput: object = await this.GetInput(input)
        return Promise.resolve(groupedInput)
    }

    private GroupByWordOccurences(inputArr: string[], containingObj: object): object {
        return inputArr.reduce((prev, curr) => {
            if (prev[curr]) {
                prev[curr] += 1;
            }
            else {
                prev[curr] = 1;
            }
            return prev;
        }, containingObj);
    }

    private async GetInput(input: string): Promise<object> {
        try {
            let groupedInput: object

            // Handling http / https URLs as input
            if (input.match(this.urlRegex)) {
                groupedInput = await this.FetchInputFromUrl(input)
                return Promise.resolve(groupedInput)
            }

            // Handling file path input
            if (input !== path.basename(input)) {
                groupedInput = await this.FetchInputFromPath(input)
                return Promise.resolve(groupedInput)
            }

            // Handling regular text input
            const filteredInput = this.FilterInput(input)
            groupedInput = this.GroupByWordOccurences(filteredInput, {})
            return Promise.resolve(groupedInput)

        } catch (e) {
            return Promise.reject(e)
        }
    }

    private FilterInput(input: string) {
        const arr = input.split(' ').filter(x => x != "")
        // I'm assuming only word are counted without punctuation marks and there's no difference in casing
        return arr.map((str) => str.replace(/(\r\n|\n|\r|\t)/gm, " ").replace(/[^\w\s]/gi, '').toLocaleLowerCase())
    }

    private async FetchInputFromPath(input: string): Promise<object> {
        const pathObj = path.parse(input)

        if (pathObj.ext !== '.txt') {
            return Promise.reject('Unsupported file extension. The only supported files are from .txt ')
        }

        return new Promise(async (resolve, reject) => {

            let readStream: fs.ReadStream
            try {
                readStream = fs.createReadStream(input, 'utf8')
                readStream.on('error', (e) => {
                    return reject(e.message)
                })

                const rl = readline.createInterface({
                    input: readStream,
                    crlfDelay: Infinity
                })

                let outputObj = {}
                for await (const line of rl) {
                    const filteredLine = this.FilterInput(line)
                    outputObj = this.GroupByWordOccurences(filteredLine, outputObj)
                }

                return resolve(outputObj)
            } catch (e) {
                reject(e)
            }
            finally {
                if (readStream) {
                    readStream.close()
                    readStream.destroy()
                }
            }
        })
    }

    private async FetchInputFromUrl(input: string): Promise<object> {

        return new Promise(async (resolve, reject) => {
            try {
                const responseStream = await Axios({
                    method: 'get',
                    url: input
                })

                if (responseStream.status !== 200) {
                    reject(`error reading data from url '${input}'`)
                    return
                }
                const filteredLine = this.FilterInput(responseStream.data)
                resolve(this.GroupByWordOccurences(filteredLine, {}))
                return
            }
            catch (e) {
                reject(e)
            }
        })
    }


}