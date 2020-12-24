import request from 'supertest'
import { app } from '../../app'

describe('For User Signup', () => {
  test('Returns "201" statusCode after succefully user created', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test.com',
        password: '12345',
      })
      .expect(201)
  })

  test('Returns "400" statusCode with invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test',
        password: '12345',
      })
      .expect(400)
  })

  test('Returns "400" statusCode with invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test',
        password: '123',
      })
      .expect(400)
  })

  test('Returns "400" statusCode with missing email and password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test',
        password: '12345',
      })
      .expect(400)

    await request(app)
      .post('/api/users/signup')
      .send({
        password: '12345',
      })
      .expect(400)
  })

  test('Disallows duplicate email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test.com',
        password: '12345',
      })
      .expect(201)

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test.com',
        password: '12345',
      })
      .expect(400)
  })

  test('Set a cookie after succefully signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@test.com',
        password: '12345',
      })
      .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
