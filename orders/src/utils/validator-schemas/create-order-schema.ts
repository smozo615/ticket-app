/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const CreateOrderSchema: Schema = {
  ticketId: {
    in: 'body',
    notEmpty: {
      errorMessage: 'ticketId must not be empty',
    },
    isString: {
      errorMessage: 'ticketId must be a string',
    },
    trim: true,
  },
};
