import Service from "..";
import { User } from "../../database/entity/user";
import { UserRepository } from "../../repository/user/updateUser";
import { TypeUpdateSchema } from "../../schemas/user/updateSchemas";
import { NotFoundError } from "../../helpers/exceptions-errors";

class UserService extends Service<User, typeof UserRepository> {
    constructor() {
        super(UserRepository);
    }
    public async updateUser(id: string, data: Partial<TypeUpdateSchema>): Promise<User> {
        await this.repository.updateUserById(id, data);
        const updatedUser = await this.repository.findOneBy({ id });

        if (updatedUser === null) throw new NotFoundError('User not found');
        return updatedUser;
    }   
}

export default UserService;