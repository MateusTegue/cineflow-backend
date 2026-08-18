import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user';

export const UserRepository = AppDataSource.getRepository(User).extend({
    async updatePassword(userId: string, newPassword: string) {
        const user = await this.findOneBy({ id: userId });
        if (!user) {
            throw new Error(`User with id ${userId} does not exist`);
        }
        user.password = newPassword;
        await this.save(user);
    }
});
