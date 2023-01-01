import Queue from 'bull';

const expirationQueue = new Queue('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  console.log('this is the job data: ', job.data);
});

export { expirationQueue };
