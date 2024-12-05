import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './database' })

const User = Schema('User', {
  _id: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true }
})

export class UserRepository {
  static create = async ({ username, password }) => {
    try {
      ValidationUser.username(username)
      ValidationUser.password(password)

      const user = User.findOne({ username })
      if (user) throw new Error('User already exists')

      const id = crypto.randomUUID()
      const hashedPassword = await bcrypt.hash(password, 10)

      User.create({
        _id: id,
        username,
        password: hashedPassword
      }).save()

      return id
    } catch (error) {
      throw new Error('Error while creating the new user')
    }
  }

  static login = async ({ username, password }) => {
    const user = User.findOne({ username })

    if (!user) throw new Error('User does not exist')

    const { password: hashedPassword } = user

    try {
      const isValid = await bcrypt.compare(password, hashedPassword)

      if (!isValid) throw new Error('Error while trying to log in')

      const { password: _, ...clientUser } = user

      return clientUser
    } catch (error) {
      throw new Error('Error while trying to log in')
    }
  }
}

class ValidationUser {
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (!username) throw new Error('Username must be defined')
    if (username.length < 4) throw new Error('Username must be at least 4 chars length')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (!password) throw new Error('Password must be defined')
    if (password.length < 6) throw new Error('Password must be at least 6 chars length')
  }
}
