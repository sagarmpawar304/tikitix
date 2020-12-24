import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { OrderStatus, Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

describe('Create a new Order', () => {
  test('Returns an error if ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId })
      .expect(404)
  })

  test('Return an error if ticket already reserved', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    })
    await ticket.save()

    const order = Order.build({
      ticket,
      userId: 'dsfdagafdv ',
      status: OrderStatus.Created,
      expiresAt: new Date(),
    })
    await order.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(400)
  })

  test('Reserves a ticket', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    })
    await ticket.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(201)
  })

  test('Emits an order created event', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    })
    await ticket.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
