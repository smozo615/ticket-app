import express from 'express';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sm-ticket-app/common';

import { createTicketRouter } from './routes/new';
import { ticketByIdRouter } from './routes/ticketById';
import { TicketsRouter } from './routes/tickets';
import { updateTicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);

// Enable JSON
app.use(express.json());

// Cookies
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Returns req.currentUser if user is authenticated
app.use(currentUser);

// Routes
app.use(createTicketRouter);
app.use(ticketByIdRouter);
app.use(TicketsRouter);
app.use(updateTicketRouter);

// Not found route
app.all('*', async (req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Errors Handler
app.use(errorHandler);

export { app };
