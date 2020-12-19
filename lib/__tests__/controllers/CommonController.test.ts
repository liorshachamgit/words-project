import app from '../../config/app'
import * as request from 'supertest'

describe('testing routes bad inputs', () => {
    it.each(['/','/api', '/api/not-exist'])('should return 404 when route is not found', async (route) => {
        const res = await request(app)
            .get(route)
            .expect(404)
            
        expect(res.body.message).toContain('handler not found')
    })

    it('should return 404 when calling route with wrong method', async () => {
        // calling GET request to a POST route
        const res = await request(app)
            .get('/api/word-counter')
            .expect(404)
            
        expect(res.body.message).toContain('handler not found')
    })
})

