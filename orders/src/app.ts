import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sptikitix/common'

import { indexOrdersRouter } from './routes/index'
import { showOrderRouter } from './routes/show'
import { newOrdersRouter } from './routes/create'
import { deleteOrdersRouter } from './routes/delete'

const app = express()
app.set('trust proxy', true)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)

// Routes
app.use(indexOrdersRouter)
app.use(showOrderRouter)
app.use(newOrdersRouter)
app.use(deleteOrdersRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
