import { PaymentCreatedEvent, Publisher, Subjects } from '@sptikitix/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
