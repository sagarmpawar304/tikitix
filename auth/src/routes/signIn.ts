import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { valiadateRequest } from '@sptikitix/common'
import { Jwt } from '../services/token'
import { User } from '../models/userModel'
import { Password } from '../services/password'
import { BadRequestError } from '@sptikitix/common'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  valiadateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    // 1) Check for existing user
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials')
    }

    // 2) Check Password
    const passwordMatch = await Password.verifyPassword(
      existingUser.password,
      password
    )
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // 3) Send response with token
    Jwt.createTokenAndSendResponse(existingUser, 200, req, res)
  }
)

export { router as signinRouter }
