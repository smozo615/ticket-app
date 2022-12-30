import { TicketUpdatedEvent } from '@sm-ticket-app/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Imagine Dragons',
    price: 100,
  });
  await ticket.save();

  // Create fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Imagine Dragons night visions',
    price: 100,
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toBeCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, ticket, msg } = await setup();

  // Change event data version
  data.version = 10;

  // Call the onMessage function and catch err
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // Write assertions to make sure ack function is called
  expect(msg.ack).not.toBeCalled();
});
