import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

describe('Cancel order', () => {
  test('Mark order as cancelled', async () => {
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

    // Cancel an particular order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204)

    // Expect that order gets updated
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  })

  test('Emits an event order cancelled', async () => {
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

    // Cancel an particular order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
