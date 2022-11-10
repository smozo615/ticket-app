import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.json({ route: 'signin' });
});

export { router as signinRouter };
