// -------------------------- Pacakges ------------------------

import Queue from 'bull'

// -------------------------- Local --------------------------

import { ExpirationCompletePublisher } from '../events'
import { natsWrapper } from '../nats-wrapper'

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
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export { expirationQueue }
