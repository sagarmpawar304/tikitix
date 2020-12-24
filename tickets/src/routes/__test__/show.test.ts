import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

describe('For A single ticket', () => {
  test('Return 400 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/tickets/${id}`).send().expect(404)
  })

  test('Return the ticket if ticket is found', async () => {
    let title, price
    title = 'concert'
    price = 20

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({ title, price })
      .expect(201)

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
  })
})
