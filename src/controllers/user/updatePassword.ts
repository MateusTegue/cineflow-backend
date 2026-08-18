import { paramsId } from "../../schemas";
import { updatePasswordSchema } from "../../schemas/user/updatePassword";
import UserService from "../../services/user/updatePassword";
import { Request } from "../../types/custom-handler";   

const updatePassword = async (req: Request<{ body: typeof updatePasswordSchema; params: typeof paramsId }>) => {
  const { id } = req.params;
  const data = req.body;
  const userService = new UserService();
  await userService.updatePassword(id, data);
  return { result: { message: 'Password updated successfully' } };
}   
export default { updatePassword };