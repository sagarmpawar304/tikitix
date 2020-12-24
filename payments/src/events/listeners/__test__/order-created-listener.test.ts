import { OrderCreatedEvent, OrderStatus } from '@sptikitix/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdfdgdfd',
    expiresAt: 'fdfaadsgdd',
    ticket: {
      id: 'dsfadsfdg',
      price: 20,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

describe('For order created listener', () => {
  test('Replicates order info', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.ticket.price)
  })

  test('Acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
  })
})
