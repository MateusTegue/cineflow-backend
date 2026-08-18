import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user'

export const UserRepository = AppDataSource.getRepository(User).extend({
    getUserById: async function (id: string): Promise<User | null> {
        return await this.findOne({ where: { id } })
    }
})