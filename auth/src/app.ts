import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@sptikitix/common'
import dotenv from 'dotenv'

import { currentUserRouter } from './routes/currentUser'
import { signupRouter } from './routes/signUp'
import { signinRouter } from './routes/signIn'
import { signoutRouter } from './routes/signOut'

const app = express()
dotenv.config()
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

// Routes
app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
