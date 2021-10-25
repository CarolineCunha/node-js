const supertest = require('supertest');
const app = require('../index');

test('GET /statement/', async()=> {
    const response = await supertest(app).get('/statement');
    expect(response.statusCode).toEqual(200);
})