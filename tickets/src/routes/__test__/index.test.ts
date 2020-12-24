import request from 'supertest'
import { app } from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'asfsdfsdf',
      price: 20,
    })
    .expect(201)
}

describe('Get Tickets', () => {
  test('Get all tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app).get('/api/tickets').send().expect(200)
    expect(response.body.length).toEqual(3)
  })
})
