import { Publisher, OrderCancelledEvent, Subjects } from '@sptikitix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
