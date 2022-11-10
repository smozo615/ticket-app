import express from 'express';

const router = express.Router();

router.get('/api/users/profile', (req, res) => {
  res.json({ route: 'profile' });
});

export { router as profileRouter };
