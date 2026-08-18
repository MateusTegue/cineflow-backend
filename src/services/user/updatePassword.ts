import Service from '..'
import { User } from '../../database/entity/user'
import { UserRepository } from '../../repository/user/updatePassword'
import { TypeUpdatePasswordSchema } from '../../schemas/user/updatePassword'
import { hashPassword } from '../../utils/bcrypt'


class UserService extends Service<User, typeof UserRepository> {
    constructor() {
        super(UserRepository);
    }
    public async updatePassword(id: string, data: TypeUpdatePasswordSchema): Promise<void> {
        const hashedPassword = await hashPassword(data.password);
        await this.repository.updatePassword(id, hashedPassword);
    }
}

export default UserService;
