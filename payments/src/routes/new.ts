import express, { Request, Response } from 'express'
import {
  requireAuth,
  valiadateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorisedError,
  OrderStatus,
} from '@sptikitix/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  valiadateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(`Payment can't done on cancelled order`)
    }

    const { id: stripeId } = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'inr',
      source: token,
      description: 'My First Test Charge (created for API docs)',
    })

    const payment = Payment.build({
      userId: req.currentUser!.id,
      orderId,
      stripeId,
    })

    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id!,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    })

    res.status(201).send({ id: payment.id })
  }
)

export { router as createChargeRouter }
