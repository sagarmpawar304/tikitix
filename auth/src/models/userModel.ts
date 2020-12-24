import mongoose from 'mongoose'
import { Password } from '../services/password'

// @desc Interface describes properties are required to create an new user
interface UserAttrs {
  email: String
  password: string
}

// @Desc Interface describes properties User Model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// @Desc Interface describes properties User Document has
interface UserDoc extends mongoose.Document {
  email: String
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  const hashedPassword = await Password.hashPassword(this.get('password'))
  this.set('password', hashedPassword)
  next()
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
