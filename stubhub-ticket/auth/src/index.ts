// ---------------- Packages -------------------------

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

// --------------- Local ---------------------------

import { errorHandler } from './middlewares'
import { NotFoundError } from './errors'
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter
} from './routes'

// -----------------------------------------------------

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    // prevent auto encrypt data we want other use info
    signed: false,
    // https only
    secure: true
  })
)

// -----------------------------------------------------

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

// -----------------------------------------------------

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY MUST BE DEFINE')

  try {
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to auth-db')
  } catch (error) {
    console.log(error)
  }
  app.listen(3000, () => {
    console.log('auth-service listening on port 3000!!!!!!!!')
  })
}

start()
