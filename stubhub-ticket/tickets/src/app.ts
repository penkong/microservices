// ---------------- Packages -------------------------

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

// --------------- Local ---------------------------

import { errorHandler, NotFoundError } from '@baneeem/common'

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

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

// -----------------------------------------------------

export { app }
