import Service from "..";
import { User } from "../../database/entity/user";
import { UserRepository } from "../../repository/user/getAllUser";

class UserService extends Service<User, typeof UserRepository> {
  constructor() {
    super(UserRepository);
  }
    public async getAll(): Promise<User[]> {
    const users = await this.repository.getAllUser()

    return users
  } 
}

export default UserService;
