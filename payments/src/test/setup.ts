import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[]
    }
  }
}

let mongo: MongoMemoryServer

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY =
  'sk_test_51HsjpUIWTnOJIzlB40n1SgqPCkqzeZP5yALcL3bCE0LBziKMqGgwHOY0FR0e6iSCjZVyFVZIi9IIoUlS65xB245w00AkCurgQS'

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
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  collections.forEach((collection) => collection.deleteMany({}))
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signup = (id?: string) => {
  // Build a JWT Payload {id,email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build a session Object {jwt:MY_JWT}
  const session = { jwt: token }

  // Turn that session into json
  const sessionJSON = JSON.stringify(session)

  // Take json and conevert into base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // Return cookie with the encoded data

  return [`express:sess=${base64}`]
}
