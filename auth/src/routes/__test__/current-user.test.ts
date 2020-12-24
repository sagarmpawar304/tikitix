import request from 'supertest'
import { app } from '../../app'

describe('For Current User', () => {
  test('Returns current user crediantials', async () => {
    const cookie = await global.signup()

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200)

    expect(response.body.currentUser.email).toEqual('user@test.com')
  })

  test('Responds null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send()
      .expect(200)

    expect(response.body.currentUser).toEqual(null)
  })
})
