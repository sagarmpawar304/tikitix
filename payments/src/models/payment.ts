import mongoose, { Document, Model } from 'mongoose'

interface PaymentAttrs {
  userId: string
  orderId: string
  stripeId: string
}

interface PaymentDoc extends Document {
  userId: string
  orderId: string
  stripeId: string
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  const { userId, orderId, stripeId } = attrs
  return new Payment({
    userId,
    orderId,
    stripeId,
  })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
)

export { Payment }
