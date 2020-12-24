import { TicketCreatedListener } from '../ticket-created-listeners'
import { TicketCreatedEvent } from '@sptikitix/common'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Creates an instance of listen
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Create a fake event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 20,
  }

  // Create a fake data
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

describe('For Ticket created listeners', () => {
  test('It creates a ticket and saves ticket', async () => {
    const { listener, data, msg } = await setup()

    // call OnMessage method with fake event data + message
    await listener.onMessage(data, msg)

    // write asseration to make sure that ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
  })

  test('ack the message', async () => {
    const { listener, data, msg } = await setup()

    // call OnMessage method with fake event data + message
    await listener.onMessage(data, msg)

    // write asseration to make sure ack function was called
    expect(msg.ack).toHaveBeenCalled()
  })
})
