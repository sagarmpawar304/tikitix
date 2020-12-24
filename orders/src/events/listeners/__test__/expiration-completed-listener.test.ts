import mongoose from 'mongoose'
import { ExpirationCompletedEvent, OrderStatus } from '@sptikitix/common'
import { Message } from 'node-nats-streaming'
import { ExpirationCompleteListener } from '../../listeners/expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    userId: 'dagdg',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id!,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, order, data, msg }
}

describe('For Expiration completed event', () => {
  test('Updates order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  })

  test('Publishes order cancelled event', async () => {
    const { listener, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(eventData.id).toEqual(order.id)
  })

  test('Acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
  })
})
