// ---------------- Packages -------------------------

import mongoose from 'mongoose'

// --------------- Local ---------------------------

import { app } from './app'

// -----------------------------------------------------

const mongoRoute = 'mongodb://tickets-mongo-service:27017/auth'

// -----------------------------------------------------

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY MUST BE DEFINE')

  try {
    await mongoose.connect(mongoRoute, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to auth-db')
  } catch (error) {
    console.log(error, 'herrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  }
  app.listen(3000, () => {
    console.log('auth-service listening on port 3000!!!!!!!!')
  })
}

// -----------------------------------------------------

start()
