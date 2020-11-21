// ---------------- Packages -------------------------

import mongoose from 'mongoose'

// --------------- Local ---------------------------

import { app } from './app'
import { TicketCreatedListener, TicketUpdatedListener } from './events'
import { natsWrapper } from './nats-wrapper'

// -----------------------------------------------------

const start = async () => {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  // env cheking
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY MUST BE DEFINE')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI MUST BE DEFINE')
  if (!process.env.NATS_URL) throw new Error('NATS_URL MUST BE DEFINE')
  if (!process.env.NATS_CLIENT_ID)
    throw new Error('NATS_CLIENT_ID MUST BE DEFINE')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('NATS_CLUSTER_ID MUST BE DEFINE')

  try {
    // connect to nats singleton
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )

    // nats listener
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()

    // nats close case
    natsWrapper.client.on('close', () => {
      console.log('nats connection closed')
      process.exit()
    })

    // nats close case
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    // connect to db
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    // confirm connection
    console.log('connected to tickets-db')
  } catch (error) {
    // db error connection
    console.log(error, 'herrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  }

  // listen server
  app.listen(3000, () => {
    console.log('tickets-service listening on port 3000!!!!!!!!')
  })
}

// -----------------------------------------------------

// trigger server
start()
