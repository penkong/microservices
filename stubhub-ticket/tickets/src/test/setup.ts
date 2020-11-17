// ------------------------ Packages --------------------------

import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

// ------------------------ Local --------------------------

import { app } from '../app'

// ------------------------ Define --------------------------

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

// ------------------------ Hooks --------------------------

let mongo: any

// hook
beforeAll(async () => {
  process.env.JWT_KEY = '123456asdf'
  mongo = new MongoMemoryServer()
  const mongoURI = await mongo.getUri()

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// hook
beforeEach(async () => {
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

global.signup = async () => {
  const email = 'test@test.com'
  const password = 'password'
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  const cookie = res.get('Set-Cookie')
  return cookie
}
