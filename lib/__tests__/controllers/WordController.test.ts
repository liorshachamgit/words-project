import app from '../../config/app'
import * as request from 'supertest'

describe('Calling endpoints with missing parameters', () => {
    it('should return 400 when calling word-statistics without query string parameters', async () => {
        const res = await request(app)
            .get('/api/word-statistics')
            .expect(400)

        expect(res.body.error).toEqual('request is missing query string parameter of word')
    })

    it('should return 400 when calling word-statistics without word in query string parameters', async () => {
        const res = await request(app)
            .get('/api/word-statistics?wrd=test')
            .expect(400)

        expect(res.body.error).toEqual('request is missing query string parameter of word')
    })

    it('should return a number of occerences for word parameter', async () => {
        const res = await request(app)
            .get('/api/word-statistics?word=test')
            .expect(200)

        expect(res).not.toBeNull()
        const num = Number(res.text)
        expect(num).not.toBeNaN()
        expect(num).toBeGreaterThanOrEqual(0)
    })

    it.each([{}, null, undefined, { "not-input": "text" }])('should fail when calling /api/word-counter without input parameter', async (body) => {
        const res = await request(app)
            .post('/api/word-counter')
            .send(body)
            .expect(400)

        expect(res.body.error).toEqual('input is missing in the reqest body')
    })

    it.each([
        { input: [1, 2, 3] },
        { input: 123 },
        { input: { "new-field": "sting" } }
    ])('should fail when calling /api/word-counter without input parameter that is not a string', async (body) => {
        const res = await request(app)
            .post('/api/word-counter')
            .send(body)
            .expect(400)

        expect(res.body.error).toEqual('Bad request - input field should be a string')
    })

    it('should fail when calling /api/word-counter without input parameter that is not a string', async () => {
        const res = await request(app)
            .post('/api/word-counter')
            .send({ input: "hello world" })
            .expect(200)
    })

    it('should increase the number of occurences for words in the input', async () => {
        const fooCount = await request(app)
            .get('/api/word-statistics?word=foo')
        const barCount = await request(app)
            .get('/api/word-statistics?word=bar')

        const res = await request(app)
            .post('/api/word-counter')
            .send({ input: "foo foo FOO bar Far BaR fOO" })
            .expect(200)

        const fooSecondCount = await request(app)
            .get('/api/word-statistics?word=foo')
        expect(Number(fooSecondCount)).toEqual(Number(fooCount) + 4)

        const barSecondCount = await request(app)
            .get('/api/word-statistics?word=bar')
        expect(Number(barSecondCount)).toEqual(Number(barCount) + 2)
    })
})

