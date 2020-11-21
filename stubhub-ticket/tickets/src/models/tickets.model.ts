// ---------------------- Packages ------------------------

import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// ---------------------- Packages ------------------------

// --------------------------------------------------------

// input info
interface ITicketAttrs {
  title: string
  price: number
  userId: string
}

// this
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc
}

// return
interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}

// --------------------------------------------------------

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String
    }
  },
  {
    // view level logic - it is function - projection
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

// -------------------------- Plugin -----------------------------------

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// -------------------------- Model Logic ------------------------------

ticketSchema.pre('save', async function (done) {
  done()
})

ticketSchema.statics.build = (attrs: ITicketAttrs) => new Ticket(attrs)

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema)

// --------------------------------------------------------

export { Ticket }
