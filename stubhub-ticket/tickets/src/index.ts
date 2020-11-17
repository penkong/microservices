// ---------------- Packages -------------------------

import mongoose from 'mongoose'

// --------------- Local ---------------------------

import { app } from './app'

// -----------------------------------------------------

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY MUST BE DEFINE')
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI MUST BE DEFINE')
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to tickets-db')
  } catch (error) {
    console.log(error, 'herrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  }
  app.listen(3000, () => {
    console.log('tickets-service listening on port 3000!!!!!!!!')
  })
}

// -----------------------------------------------------

start()
