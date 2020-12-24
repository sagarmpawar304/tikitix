import mongoose, { Model, Document } from 'mongoose'
import { OrderStatus } from '@sptikitix/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  id: string
  userId: string
  version: number
  price: number
  status: OrderStatus
}

interface OrderDoc extends Document {
  userId: string
  version: number
  price: number
  status: OrderStatus
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id, userId, status, price, version } = attrs
  return new Order({
    _id: id,
    version,
    userId,
    price,
    status,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
