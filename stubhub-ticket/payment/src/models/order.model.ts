// ---------------------- Packages ------------------------

import mongoose, { version } from 'mongoose'
import { OrderStatusEnum } from '@baneeem/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// ---------------------- Packages ------------------------

// --------------------------------------------------------

// input info
interface IOrderAttrs {
  id: string
  status: OrderStatusEnum
  version: number
  price: number
  userId: string
}

// this - current
interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc
}

// return
interface IOrderDoc extends mongoose.Document {
  status: OrderStatusEnum
  version: number
  price: number
  userId: string
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
      enum: Object.values(OrderStatusEnum)
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    // view level logic - it is function - projection - doc , returnValue
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

// -------------------------- Plugin ------------------------------

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

// -------------------------- Model Logic ------------------------------

// middleware
orderSchema.pre('save', async function (done) {
  done()
})

// model
orderSchema.statics.build = (attrs: IOrderAttrs) =>
  new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  })

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema)

// --------------------------------------------------------

export { Order }
