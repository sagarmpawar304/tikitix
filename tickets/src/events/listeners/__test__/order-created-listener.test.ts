import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from '@sptikitix/common'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Create an instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create and save ticket
  const ticket = Ticket.build({
    userId: 'asdfsfd',
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  // Create a fake Event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'dsafadfd',
    expiresAt: 'random date',
    ticket: {
      id: ticket.id!,
      price: ticket.price,
    },
  }

  // Create fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  // Return all
  return { listener, ticket, data, msg }
}

describe('For order-created-listeners', () => {
  test('sets the orderId  of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
  })

  test('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
  })

  test('Publish ticket updated event', async () => {
    const { listener, data, ticket, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    expect(data.id).toEqual(ticketUpdatedData.orderId)
  })
})
