import express from 'express';

import { profileRouter } from './routes/profile';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';

const PORT = 4000;

const app = express();

app.use(express.json());

// Routes
app.use(profileRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

// Errors Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
