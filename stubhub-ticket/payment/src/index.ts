// ---------------- Packages -------------------------

import mongoose from 'mongoose'

// --------------- Local ---------------------------

import { app } from './app'
import { OrderCancelledLitener, OrderCreatedLitener } from './events'
import { natsWrapper } from './nats-wrapper'

// -----------------------------------------------------

const start = async () => {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY MUST BE DEFINE')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI MUST BE DEFINE')
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
    new OrderCancelledLitener(natsWrapper.client).listen()

    natsWrapper.client.on('close', () => {
      console.log('nats connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to tickets-db')
  } catch (error) {
    console.log(error, 'here')
  }
  app.listen(3000, () => {
    console.log('payment-service listening on port 3000!!!!')
  })
}

// -----------------------------------------------------

start()
