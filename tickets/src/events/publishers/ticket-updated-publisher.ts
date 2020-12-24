import { Publisher, Subjects, TicketUpdatedEvent } from '@sptikitix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
