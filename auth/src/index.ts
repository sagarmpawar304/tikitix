import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  console.log('Starting up..')

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    mongoose.set('useUnifiedTopology', true)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log('Database succeffully connected')
  } catch (error) {
    console.error(error)
  }
  // Server
  app.listen(3000, () => {
    console.log(`Auth is listening on Port:${3000}`)
  })
}

start()
