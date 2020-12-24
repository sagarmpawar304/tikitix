import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sptikitix/common'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { getAllTickets } from './routes/index'
import { updateTicketRouter } from './routes/update'

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
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(getAllTickets)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
