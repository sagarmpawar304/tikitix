import { Publisher, OrderCreatedEvent, Subjects } from '@sptikitix/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
