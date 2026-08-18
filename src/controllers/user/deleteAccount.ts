import { paramsId } from "../../schemas";
import UserService from "../../services/user/deleteAccount";
import { Request } from "../../types/custom-handler";

const deleteAccount = async (req: Request<{ params: typeof paramsId }>) => {
  const userService = new UserService();
  await userService.deleteAccount(req.params.id);
  return { result: { message: 'Account deleted successfully' } };
}
export default { deleteAccount };