import express, { Request, Response } from 'express'
import {
  requireAuth,
  valiadateRequest,
  NotFoundError,
  BadRequestError,
} from '@sptikitix/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order, OrderStatus } from '../models/order'
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .isMongoId()
      .withMessage('TicketId must be provided'),
  ],
  valiadateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    // Find the ticket that user want to purchase in to the database
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    // Check Ticket is reserved or not
    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate Expiration Date for Order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build an Order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })

    await order.save()

    // Publish an event for Order created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id!,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id!,
        price: ticket.price,
      },
    })

    res.status(201).send(order)
  }
)

export { router as newOrdersRouter }
