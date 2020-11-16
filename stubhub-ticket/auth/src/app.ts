// ---------------- Packages -------------------------

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
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
    secure: process.env.NODE_ENV !== 'test'
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

export { app }
