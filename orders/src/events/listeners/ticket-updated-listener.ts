import { Message } from 'node-nats-streaming'
import { Listener, TicketUpdatedEvent, Subjects } from '@sptikitix/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data

    const ticket = await Ticket.findByIdAndPreviousVersion({ id, version })
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title, price })
    await ticket.save()
    // console.log(ticket)

    msg.ack()
  }
}
