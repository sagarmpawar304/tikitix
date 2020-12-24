import { Publisher, Subjects, TicketCreatedEvent } from '@sptikitix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
