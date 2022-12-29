import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@sm-ticket-app/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({ price, title, id });
    await ticket.save();

    msg.ack();
  }
}
