import express from 'express';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sm-ticket-app/common';

import { createOrderRouter } from './routes/new';
import { orderByIdRouter } from './routes/order-by-id';
import { ordersRouter } from './routes/orders';
import { deleteOrderRouter } from './routes/delete';

const app = express();

app.set('trust proxy', true);

// Enable JSON
app.use(express.json());

// Cookies
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// Returns req.currentUser if user is authenticated
app.use(currentUser);

// Routes
app.use(createOrderRouter);
app.use(orderByIdRouter);
app.use(ordersRouter);
app.use(deleteOrderRouter);

// Not found route
app.all('*', async (req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Errors Handler
app.use(errorHandler);

export { app };
