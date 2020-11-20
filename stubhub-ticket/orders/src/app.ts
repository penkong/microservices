// ---------------- Packages -------------------------

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@baneeem/common'

// --------------- Local ---------------------------

import {
  deleteOrderRouter,
  allOrdersRouter,
  newOrderRouter,
  showOrderRouter
} from './routes'

// -----------------------------------------------------

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    // prevent auto encrypt data we want other use info
    signed: false,
    // https only other test
    secure: process.env.NODE_ENV !== 'test'
  })
)
app.use(currentUser)

// -----------------------------------------------------

app.use(deleteOrderRouter)
app.use(allOrdersRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

// -----------------------------------------------------

export { app }
