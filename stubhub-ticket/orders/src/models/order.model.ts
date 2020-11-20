// ---------------------- Packages ------------------------

import mongoose from 'mongoose'
import { OrderStatusEnum } from '@baneeem/common'
import { ITicketDoc } from '.'

// ---------------------- Packages ------------------------

// --------------------------------------------------------

// input info
interface IOrderAttrs {
  userId: string
  status: OrderStatusEnum
  expireAt: Date
  ticket: ITicketDoc
}

// this - current
interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc
}

// return
interface IOrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatusEnum
  expireAt: Date
  ticket: ITicketDoc
}

// --------------------------------------------------------

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.Created
    },
    expireAt: {
      type: mongoose.Schema.Types.Date
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
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

// -------------------------- Model Logic ------------------------------

orderSchema.pre('save', async function (done) {
  done()
})

orderSchema.statics.build = (attrs: IOrderAttrs) => new Order(attrs)

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema)

// --------------------------------------------------------

export { Order }
