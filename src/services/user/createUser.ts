import Service from '..'
import { User } from '../../database/entity/user'
import { UserRepository } from '../../repository/user/createUser'
import { TypeCreateSchema } from '../../schemas/user/createSchemas'
import { hashPassword } from '../../utils/bcrypt'

class UserService extends Service<User, typeof UserRepository> {
  constructor() {
    super(UserRepository)
  }
    public async createUser(data: TypeCreateSchema): Promise<User> {  
    const hashedPassword = await hashPassword(data.password)

    const user = await this.repository.createUser({
        ...data,
        password: hashedPassword 
      }
      , data.roleId
      )
      return user
    }
}
export default UserService;