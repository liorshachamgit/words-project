const InputService = require('../../modules/services/InputParserService')

let service

beforeAll(() => {
    service = new InputService.InputParserService()
})

describe('Test ParseInput validation', () => {
    it('should fail when input is null', async () => {
        try {
            const res = await service.ParseInput(null)
        } catch (e) {
            expect(e).not.toBeNull()
            expect(e).toEqual('bad input')
        }
    })

    it('should fail when input is undefined', async () => {
        try {
            const res = await service.ParseInput(undefined)
        } catch (e) {
            expect(e).not.toBeNull()
            expect(e).toEqual('bad input')
        }
    })

    it('should fail when input is undefined', async () => {
        try {
            const res = await service.ParseInput()
        } catch (e) {
            expect(e).not.toBeNull()
            expect(e).toEqual('bad input')
        }
    })

    it('should fail when input is not a string', async () => {
        try {
            const res = await service.ParseInput({})
        } catch (e) {
            expect(e).not.toBeNull()
            expect(e).toEqual('bad input')
        }
    })
})

describe('Regular text input - ', () => {
    it('should return object with occurences count when receving the same word', async () => {
        const input = `hello, hello HELlo HELLO , , hellO`
        const res = await service.ParseInput(input)
        expect(res).not.toBeNull()
        expect(res.hello).toEqual(5)
    })

    it('should return object with occurences count', async () => {
        const input = `I'm Slim Shady, yes I'm the real Shady
                        All you other Slim Shadys, are just imitating
                        So won't the real Shady, please stand up
                        Please stand up, please stand up`
        const res = await service.ParseInput(input)
        expect(res).not.toBeNull()
        expect(res.slim).toEqual(2)
        expect(res.shady).toEqual(3)
        expect(res).toMatchSnapshot()

    })

})

describe('File system input - ', () => {
    describe('Failing inputs', () => {
        it('should return error when directory not found', async () => {
            try {
                await service.ParseInput('c:\\non-existing-dir\\file.txt')
            } catch (e) {
                expect(e).toContain('no such file or directory')
            }
        });

        it('should return error when file not found', async () => {
            try {
                await service.ParseInput('C:\\Users\\lior\\Documents\\Projects\\word project\\test files\\missingFile.txt')
            } catch (e) {
                expect(e).toMatch('no such file or directory')
            }
        });

        // it.each([
        //     'C:\\Users\\lior\\Documents\\Projects\\word project\\test files\\input.jpg',
        //     'C:\\Users\\lior\\Documents\\Projects\\word project\\test files\\email.csv',
        //     'C:\\Users\\lior\\Documents\\Projects\\word project\\test files\\input'
        //     ])('should return error when file has unsupported extension', async (path) => {
        //     try {
        //         await service.ParseInput(path)
        //     } catch (e) {
        //         expect(e).toMatch('Unsupported file extension. The only supported files are from .txt')
        //     }
        // });

    });

    describe('Success inputs', () => {
        it('should return occurences object for full path', async () => {
            const data = await service.ParseInput('C:\\Users\\lior\\Documents\\Projects\\word project\\test files\\forgetAboutDre.txt')
            expect(data).not.toBeNull()
            expect(data.you).toEqual(26)
            expect(data.dre).toEqual(10)
            expect(data).toMatchSnapshot()
        });

        it('should return occurences object for relative path', async () => {
            const data = await service.ParseInput('./test files/Smells Like Teen Spirit.txt')
            expect(data).not.toBeNull()
            expect(data.hello).toEqual(36)
            expect(data.entertain).toEqual(6)
            expect(data).toMatchSnapshot()
        });
    });
});

describe('URL path input - ', () => {
    it('should get content of https request ', async () => {
        const url = 'https://baconipsum.com/api/?type=meat-and-filler&paras=100&format=text'
        const data = await service.ParseInput(url)
        expect(data).not.toBeNull()
    });

    // it.each(['json', 'html'])('should fail when trying to read format that is not text ', async (format) => {
    //     try {
    //         const url = `https://baconipsum.com/api/?type=meat-and-filler&paras=100&format=${format}`
    //         await service.ParseInput(url)
    //     } catch (e) {
    //         expect(e).not.toBeNull()
    //     }
    // });
});