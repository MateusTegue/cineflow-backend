import Service from "..";
import { User } from "../../database/entity/user";
import { UserRepository } from "../../repository/user/deleteAccount";
import { NotFoundError } from "../../helpers/exceptions-errors";
import { status } from "../../utils/models";

class UserService extends Service<User, typeof UserRepository> {
    constructor() {
        super(UserRepository);
    }
    public async deleteAccount(id: string): Promise<void> {
        const user = await this.repository.findOneBy({ id });   
        if (user === null) throw new NotFoundError("User not found");
        user.status = status.INACTIVE;
        await this.repository.save(user);
    }
}

export default UserService;