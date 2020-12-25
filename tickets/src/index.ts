import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )

    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed')
      process.exit()
    })

    // Close stan when received termination or interupt signals
    process.on('SIGTERM', () => natsWrapper.client.close())
    process.on('SIGINT', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    mongoose.set('useUnifiedTopology', true)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log('Database successfully connected')
  } catch (error) {
    console.error(error)
  }
  // Server
  app.listen(3000, () => {
    console.log(`Tickets is listening on Port:${3000}`)
  })
}

start()
