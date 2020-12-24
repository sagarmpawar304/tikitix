import { Listener, Subjects, OrderCancelledEvent } from '@sptikitix/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })
    await ticket.save()

    const { orderId, userId, title, price, version } = ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id!,
      orderId,
      userId,
      title,
      price,
      version,
    })

    msg.ack()
  }
}
