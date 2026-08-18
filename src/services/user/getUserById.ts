import Service from "..";
import { User } from "../../database/entity/user";
import { UserRepository } from "../../repository/user/getUserById";


class UserService extends Service<User, typeof UserRepository> {
    constructor() {
        super(UserRepository)
    }
    public async getUserById(id: string): Promise<User | null> {
        return await this.repository.getUserById(id)
    }
}

export default UserService;