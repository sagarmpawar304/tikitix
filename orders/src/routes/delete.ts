import express, { Request, Response } from 'express'
import {
  requireAuth,
  NotAuthorisedError,
  NotFoundError,
  OrderStatus,
} from '@sptikitix/common'
import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // Publish an event  for order get cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id!,
      version: order.version,
      ticket: {
        id: order.ticket.id!,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrdersRouter }
