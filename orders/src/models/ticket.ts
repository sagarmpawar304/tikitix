import mongoose, { Model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from '../models/order'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByIdAndPreviousVersion(event: {
    id: string
    version: number
  }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
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

ticketSchema.plugin(updateIfCurrentPlugin)

// Alernate method for updating version
// ticketSchema.pre('save', function (done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1,
//   }
//   done()
// })

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

ticketSchema.statics.findByIdAndPreviousVersion = (event: {
  id: string
  version: number
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

// Run query to look all records.Find the order that has same ticket that we found and
// its status is not *cancelled*.If we found the ticket means ticket is already reserved.
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })
  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
