import express from 'express';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sm-ticket-app/common';
import { createTicketRouter } from './routes/new';

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

// Routes
app.use(createTicketRouter);

// Not found route
app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

// Errors Handler
app.use(errorHandler);

export { app };
