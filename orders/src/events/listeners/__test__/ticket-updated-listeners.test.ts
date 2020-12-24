import { TicketUpdatedListener } from '../ticket-updated-listener'
import { TicketUpdatedEvent } from '@sptikitix/common'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Creates an instance of listen
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create a ticket and save to the database
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'movie',
    price: 20,
  })
  await ticket.save()

  // Create a fake event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
    title: 'concert',
    price: 20,
  }

  // Create a fake data
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, ticket, msg }
}

describe('For ticket updated listeners', () => {
  test('It finds, update and save the ticket', async () => {
    const { listener, data, ticket, msg } = await setup()

    // call OnMessage method with fake event data + message
    await listener.onMessage(data, msg)

    // write asseration to make sure that ticket was created
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.version).toEqual(data.version)
  })

  test('asks the message', async () => {
    const { listener, data, msg } = await setup()

    // call OnMessage method with fake event data + message
    await listener.onMessage(data, msg)

    // write asseration to make sure ack function was called
    expect(msg.ack).toHaveBeenCalled()
  })

  test('It does not call ack function if the event does not have immediate next version', async () => {
    const { listener, data, msg } = await setup()
    data.version = 10
    try {
      await listener.onMessage(data, msg)
    } catch (error) {}
    expect(msg.ack).not.toHaveBeenCalled()
  })
})
