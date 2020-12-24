import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subject'

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'payment service'
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`Event data`, data)

    msg.ack()
  }
}
