import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  collections.forEach((collection) => collection.deleteMany({}))
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signup = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@test.com',
      password: '12345',
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
