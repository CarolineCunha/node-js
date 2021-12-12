const request = require('supertest');
const app = require('../server');

describe('Test post account', () => {
    it('should post account', async () => {
        const res = await request(app).post('/account/')
        .send({
            "cpf":"33456677854",
            "name":"Carol"
        })
        expect(res.statusCode).toBe(201)
    })
})

describe('Test get statement', () => {
    it('should get statement', async () => {
        const res = await request(app).get('/statement/').set('cpf', '33456677854')
        expect(res.statusCode).toBe(200)
    })
})