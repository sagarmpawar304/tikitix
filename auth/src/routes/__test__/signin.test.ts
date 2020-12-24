import request from 'supertest'
import { app } from '../../app'

describe('For User Signin ', () => {
  test('fails when email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({ email: 'user@test.com', password: '12345' })
      .expect(400)
  })

  test('Fails when incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'user@test.com', password: '12345' })
      .expect(201)

    await request(app)
      .post('/api/users/signin')
      .send({ email: 'user@test.com', password: '123' })
      .expect(400)
  })

  test('Set a cookie when correct credientials are provided', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'user@test.com', password: '12345' })
      .expect(201)

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email: 'user@test.com', password: '12345' })
      .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
