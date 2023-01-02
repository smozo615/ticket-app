/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const CreateChargeSchema: Schema = {
  orderId: {
    in: 'body',
    notEmpty: {
      errorMessage: 'orderId must not be empty',
    },
    isString: {
      errorMessage: 'orderId must be a string',
    },
    trim: true,
  },
  token: {
    in: 'body',
    notEmpty: {
      errorMessage: 'token must not be empty',
    },
    isString: {
      errorMessage: 'token must be a string',
    },
    trim: true,
  },
};
