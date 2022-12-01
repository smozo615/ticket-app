import { Publisher, TicketUpdatedEvent, Subjects } from '@sm-ticket-app/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
