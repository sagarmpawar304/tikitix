import { Listener, OrderCreatedEvent, Subjects } from '@sptikitix/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that is order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If Ticket is not found throw an error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Mark ticket as reserved by setting its order property
    ticket.set({ orderId: data.id })

    // Save ticket
    await ticket.save()

    // Publish an event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id!,
      userId: ticket.userId,
      orderId: ticket.orderId!,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    })

    // Ack the message
    msg.ack()
  }
}
