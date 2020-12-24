import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export class Jwt {
  static createTokenAndSendResponse = (
    user: any,
    statusCode: number,
    req: Request,
    res: Response
  ): Object => {
    // 1) Create JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    )

    // 2) Store it on store Object
    req.session = {
      jwt: userJwt,
    }

    // 3) Send response
    return res.status(statusCode).send(user)
  }
}
