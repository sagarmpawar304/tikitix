import {
  Publisher,
  ExpirationCompletedEvent,
  Subjects,
} from '@sptikitix/common'

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete
}
