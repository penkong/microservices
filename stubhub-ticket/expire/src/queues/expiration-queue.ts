// -------------------------- Pacakges ------------------------

import Queue, { Job } from 'bull'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

interface IPayload {
  orderId: string
}

// -----------------------------------------------------------

const expirationQueue = new Queue<IPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async (job) => {
  console.log('publish an expire event:complete with orderId', job.data.orderId)
})

export { expirationQueue }
