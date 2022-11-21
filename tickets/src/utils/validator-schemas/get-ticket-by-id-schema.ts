/**
 * These schemas are used to validate data with express-validator,
 * The schemas are passed to the function checkSchema()
 */
import { Schema } from 'express-validator';

export const MongoIdSchema: Schema = {
  id: {
    in: 'params',
    notEmpty: {
      errorMessage: 'id must be provided',
    },
    isMongoId: {
      errorMessage: 'id must be a valid mongoId',
    },
  },
};
