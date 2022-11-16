import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // Destroy cookie
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
