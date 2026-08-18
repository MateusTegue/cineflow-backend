import { QueryDeepPartialEntity } from 'typeorm/browser/query-builder/QueryPartialEntity.js';
import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user';

export const UserRepository = AppDataSource.getRepository(User).extend({
    updateUserById: async function (id: string, body: QueryDeepPartialEntity<User>) {
        return await this.update({ id }, body)
    }
})