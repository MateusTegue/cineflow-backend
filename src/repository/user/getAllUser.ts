import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user'
import { role } from '../../utils/models'
import { NotFoundError } from '../../helpers/exceptions-errors'


export const UserRepository = AppDataSource.getRepository(User).extend({
  getAllUser: async function (): Promise<User[]> {
    const users = await this.find(
        { where: { role: { name: role.USER } } }
    )
    if (users.length === 0) {
      throw new NotFoundError('No users found')
    }

    return users
  },
})
