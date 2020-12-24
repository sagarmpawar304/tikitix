import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../models/userModel'
import { BadRequestError } from '@sptikitix/common'
import { valiadateRequest } from '@sptikitix/common'
import { Jwt } from '../services/token'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must have characters between 4 to 20'),
  ],
  valiadateRequest,
  async (req: Request, res: Response) => {
    // 1) Check for Errors provided by Validators
    const { email, password } = req.body

    // 2) Check user already exist
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email already in use')
    }

    // 3) Create new user
    const user = User.build({ email, password })
    await user.save()

    // 4) Send response with Token
    Jwt.createTokenAndSendResponse(user, 201, req, res)
  }
)

export { router as signupRouter }
