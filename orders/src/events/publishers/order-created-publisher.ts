import { Publisher, OrderCreatedEvent, Subjects } from '@sm-ticket-app/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
