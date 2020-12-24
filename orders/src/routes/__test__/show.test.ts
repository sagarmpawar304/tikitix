import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

describe('Fetch a order to respective owner', () => {
  test('Fetch a order for current user', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    })
    await ticket.save()

    const user = global.signup()

    // Create an Order
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    // Fetch an particular order
    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)
  })

  test('Return an error if one user try to fetch another users order details', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    })
    await ticket.save()

    const user = global.signup()

    // Create an Order
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    // Fetch an particular order
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signup())
      .send()
      .expect(401)
  })
})
