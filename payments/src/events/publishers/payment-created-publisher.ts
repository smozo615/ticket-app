import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@sm-ticket-app/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
