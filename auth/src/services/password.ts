import bcrypt from 'bcrypt'

export class Password {
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
  }

  static async verifyPassword(hashedPassword: string, plainPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
