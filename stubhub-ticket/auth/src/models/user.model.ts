// ---------------------- Packages ------------------------

import mongoose from 'mongoose'

// ---------------------- Packages ------------------------

import { Password } from '../services'

// --------------------------------------------------------

interface IUserAttrs {
  email: string
  password: string
}

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc
}

interface IUserDoc extends mongoose.Document {
  email: string
  password: string
}

// --------------------------------------------------------

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// -------------------------- Model Logic ------------------------------

userSchema.pre('save', async function (done) {
  // when this work , on pass change not email change or what ever
  // also pass creation consider modification
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

userSchema.statics.build = (attrs: IUserAttrs) => new User(attrs)

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)

// --------------------------------------------------------

User.build({ email: 'test@test.com', password: '12345678' })

export { User }
