import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entity/user";

export const UserRepository = AppDataSource.getRepository(User).extend({
    deleteAccountById: async function (id: string): Promise<void> {
        const user = await this.findOneBy({ id });
        if (!user) {
            throw new Error(`User with id ${id} does not exist`);
        }
        await this.delete({ id });
    },
})