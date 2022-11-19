/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const CreateTicketSchema: Schema = {
  title: {
    in: 'body',
    notEmpty: {
      errorMessage: 'Title must not be empty',
    },
    isString: {
      errorMessage: 'Title must be a string',
    },
    trim: true,
  },
  price: {
    in: 'body',
    isFloat: {
      errorMessage: 'Price should be a number greater than 0',
      options: { min: 0 },
    },
    notEmpty: {
      errorMessage: 'Price must not be empty',
    },
  },
};
