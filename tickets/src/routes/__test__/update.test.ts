import request from 'supertest'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'

describe('For Ticket update', () => {
  let title = 'addsafsd'
  let price = 20
  test('Return status 404 if id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signup())
      .send({
        title,
        price,
      })
      .expect(404)
  })

  test('Return status 401 if user not autheniticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title,
        price,
      })
      .expect(401)
  })

  test('Return status 401 if user does not own the ticket', async () => {
    const cookie = global.signup()
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(201)

    const id = response.body.id
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signup())
      .send({ title, price })
      .expect(401)
  })

  test('Return status 400 if user provide invalid title and price', async () => {
    const cookie = global.signup()
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(201)

    const id = response.body.id
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ price })
      .expect(400)

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'sdfdfs', price: -10 })
      .expect(400)
  })

  test('Return status 200 if user authenticated and provide valid data', async () => {
    const cookie = global.signup()
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(201)

    const id = response.body.id
    title = 'dsgfdgxcvbdsg'
    price = 56
    const newResponse = await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(200)

    expect(newResponse.body.title).toEqual(title)
    expect(newResponse.body.price).toEqual(price)
  })

  test('Rejects update if ticket is reserved', async () => {
    const cookie = global.signup()
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(201)

    const id = response.body.id
    title = 'concert'
    price = 56

    const ticket = await Ticket.findById(id)
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', cookie)
      .send({ title, price })
      .expect(400)
  })
})
