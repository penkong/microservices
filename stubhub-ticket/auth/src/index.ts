// ---------------- Packages -------------------------

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

// --------------- Local ---------------------------

import { errorHandler } from './middlewares'
import { NotFoundError } from './errors'
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes'

// -----------------------------------------------------

const app = express()
app.use(json())

// -----------------------------------------------------

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.all('*', async (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

// -----------------------------------------------------

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!!!')
})
