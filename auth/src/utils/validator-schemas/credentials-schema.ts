/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const CredentialsSchema: Schema = {
  email: {
    in: 'body',
    notEmpty: {
      errorMessage: 'It must not be empty',
    },
    isEmail: {
      errorMessage: 'It must be a valid email',
    },
    trim: true,
  },
  password: {
    in: 'body',
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      options: { min: 7 },
    },
    matches: {
      errorMessage: 'Password should have an integer',
      options: /\d/,
    },
    notEmpty: {
      errorMessage: 'It must not be empty',
    },
  },
};
