// ---------------------- Packages ------------------------

import { OrderStatusEnum } from '@baneeem/common'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// ---------------------- Packages ------------------------

import { Order } from '.'

// --------------------------------------------------------

// input info
interface ITicketAttrs {
  id: string
  title: string
  price: number
}

// this
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc
  findOnEvent(event: {
    id: string
    version: number
  }): Promise<ITicketDoc | null>
}

// return
export interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
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
      required: true,
      min: 0
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

// middleware
ticketSchema.pre('save', async function (done) {
  // this
  // for case without plugin
  // @ts-ignore
  // this.$where = {
  //   version: this.get('version') - 1
  // }
  done()
})

// add method to model
ticketSchema.statics.build = (attrs: ITicketAttrs) =>
  new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  })

// add method to model
ticketSchema.statics.findOnEvent = (event: { id: string; version: number }) =>
  Ticket.findOne({ _id: event.id, version: event.version })

// add method to schema
ticketSchema.methods.isReserved = async function () {
  // this == the doc we just call method on it .
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatusEnum.Created,
        OrderStatusEnum.AwaitingPayment,
        OrderStatusEnum.Complete
      ]
    }
  })

  return !!existingOrder
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema)

// --------------------------------------------------------

export { Ticket }
