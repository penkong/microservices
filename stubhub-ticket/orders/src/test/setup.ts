// ------------------------ Packages --------------------------

import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
// import request from 'supertest'

// ------------------------ Local --------------------------

// import { app } from '../app'

// ------------------------ Define --------------------------

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[]
    }
  }
}

// ------------------------ Mock Funcs --------------------------

jest.mock('../nats-wrapper')

// ------------------------ Hooks --------------------------

let mongo: any

// hook
beforeAll(async () => {
  process.env.JWT_KEY = '123456asdf'
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  mongo = new MongoMemoryServer()
  const mongoURI = await mongo.getUri()

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// hook
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

// hook
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

// -------------------------- Global Helpers -------------------------

global.signup = () => {
  // build a jwt payload . { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // build session  { jwt: 'our jwt decoded from base 64' }
  const session = { jwt: token }

  // session to json
  const sessionJSON = JSON.stringify(session)

  // encode json
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a cookie set
  return [`express:sess=${base64}`]
}
