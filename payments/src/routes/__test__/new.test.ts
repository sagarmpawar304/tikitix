import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order } from '../../models/order'
import { OrderStatus } from '@sptikitix/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

describe('For new order payment', () => {
  test('Returns 404 if order does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup())
      .send({
        token: 'dassadfsd',
        orderId: mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404)
  })

  test('Returns 401 if paying for order but that order not belongs to the user ', async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      price: 20,
    })
    await order.save()

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup())
      .send({
        token: 'dassadfsd',
        orderId: order.id!,
      })
      .expect(401)
  })

  test('Returns 400 if order is cancelled ', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      status: OrderStatus.Created,
      price: 20,
    })
    await order.save()

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup(userId))
      .send({
        token: 'dassadfsd',
        orderId: order.id!,
      })
      .expect(400)
  })

  test('returns 204 for valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      status: OrderStatus.Created,
      price,
    })
    await order.save()

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signup(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id!,
      })
      .expect(201)

    const { data } = await stripe.charges.list({ limit: 50 })
    const stripeCharge = data.find((charge) => charge.amount === price * 100)

    expect(stripeCharge).toBeDefined()
    expect(stripeCharge?.currency).toEqual('inr')

    const payment = await Payment.findOne({
      orderId: order.id!,
      stripeId: stripeCharge!.id,
    })

    expect(payment).not.toBeNull()
  })
})
