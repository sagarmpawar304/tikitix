import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

describe('Get Orders', () => {
  test('Return orders for the particular user', async () => {
    // Create three orders
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = global.signup()
    const userTwo = global.signup()

    // Create one Order for user #1
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201)

    // Create two Order for user #2
    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201)

    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201)

    // Make request to get all orders related to the user #2
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .send()
      .expect(200)

    // Get all orders related to orders user #2
    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
  })
})
