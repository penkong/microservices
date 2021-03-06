// ---------------- Packages -------------------------

// --------------- Local ---------------------------

import { natsWrapper } from './nats-wrapper'
import { OrderCreatedLitener } from './events'

// -----------------------------------------------------

const start = async () => {
  if (!process.env.NATS_URL) throw new Error('NATS_URL MUST BE DEFINE')
  if (!process.env.NATS_CLIENT_ID)
    throw new Error('NATS_CLIENT_ID MUST BE DEFINE')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('NATS_CLUSTER_ID MUST BE DEFINE')
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )

    new OrderCreatedLitener(natsWrapper.client).listen()

    natsWrapper.client.on('close', () => {
      console.log('nats connection closed')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
  } catch (error) {
    console.log(error, 'herrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  }
}

// -----------------------------------------------------

start()
