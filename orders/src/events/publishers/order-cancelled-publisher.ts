import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@sm-ticket-app/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
