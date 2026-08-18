import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user'

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByEmail: async function (email: string): Promise<User | null> {
    const user = await this.findOneBy({ email })
    if (!user) {
      return null
    }
    return user
  },
})


