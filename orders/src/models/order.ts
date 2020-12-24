import mongoose, { Model, Document } from 'mongoose'
import { OrderStatus } from '@sptikitix/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

interface OrderAtts {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends Document {
  userId: string
  version: number
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderModel extends Model<OrderDoc> {
  build(atts: OrderAtts): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  },
  {
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAtts) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
