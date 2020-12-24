import { OrderCancelledEvent, OrderStatus } from '@sptikitix/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listner'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: 'dsfass',
    version: 0,
    status: OrderStatus.Created,
    price: 20,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id!,
    version: 1,
    ticket: {
      id: 'dsfadsfdg',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

describe('For Order-cancelled-event', () => {
  test('Updates status of order to "Cancelled"', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(data.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  })

  test('Acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
  })
})
