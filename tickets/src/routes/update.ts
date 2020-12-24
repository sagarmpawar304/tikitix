import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import {
  requireAuth,
  valiadateRequest,
  NotFoundError,
  NotAuthorisedError,
  BadRequestError,
} from '@sptikitix/common'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is required'),
  ],
  valiadateRequest,
  async (req: Request, res: Response) => {
    // 1) Check Ticket exist
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }

    // 2) If Ticket is reserved then cannot update ticket
    if (ticket.orderId) {
      throw new BadRequestError('Cannot update a reserved ticket')
    }

    // 2) Check ticket belongs to Own the current user
    if (req.currentUser?.id !== ticket.userId) {
      throw new NotAuthorisedError()
    }

    // 3) Update ticket
    const { title, price } = req.body
    ticket.set({
      title,
      price,
    })
    await ticket.save()

    // 4) Send a response
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id!,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })
    res.send(ticket)
  }
)

export { router as updateTicketRouter }
