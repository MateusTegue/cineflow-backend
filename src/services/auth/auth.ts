import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../../repository/user/findByEmail'
import { status } from '../../utils/models'
import { NotAuthorizedError, PermissionDeniedError } from '../../helpers/exceptions-errors'


export const authService = {
  login: async (email: string, password: string) => {

    const user = await UserRepository.findByEmail(email)

    if (!user) throw new NotAuthorizedError('User not found')
    if (user.status !== status.ACTIVE) throw new PermissionDeniedError('User is inactive')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new NotAuthorizedError('Invalid credentials')

    const token = jwt.sign(
      { id: user.id, identifier: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    )
    const { password: _, ...userWithoutPassword } = user

    return { token, user: userWithoutPassword }
  }
}
