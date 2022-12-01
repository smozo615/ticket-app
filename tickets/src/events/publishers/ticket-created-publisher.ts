import { Publisher, TicketCreatedEvent, Subjects } from '@sm-ticket-app/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
