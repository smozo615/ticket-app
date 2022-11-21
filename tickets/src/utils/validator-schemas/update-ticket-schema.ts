/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const updateTicketSchema: Schema = {
  id: {
    in: 'params',
    notEmpty: {
      errorMessage: 'id must be provided',
    },
    isMongoId: {
      errorMessage: 'id must be a valid mongoId',
    },
  },
  title: {
    in: 'body',
    isString: {
      errorMessage: 'Title must be a string',
    },
    optional: true,
  },
  price: {
    in: 'body',
    isFloat: {
      errorMessage: 'Price should be a number greater than 0',
      options: { min: 0 },
    },
    optional: true,
  },
};
