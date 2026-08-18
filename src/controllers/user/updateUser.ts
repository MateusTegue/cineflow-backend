import { paramsId } from "../../schemas"; 
import { updateUserSchema } from "../../schemas/user/updateSchemas";
import UserService from "../../services/user/updateUser";
import { Request } from "../../types/custom-handler";


const update = async (req: Request<{ body: typeof updateUserSchema; params: typeof paramsId }>) => {
  const { id } = req.params
  const data = req.body
  const userService = new UserService()
  const user = await userService.updateUser(id, data)
  return { result: { data: user, message: 'User Updated succesfully' } }
}
export default { update }