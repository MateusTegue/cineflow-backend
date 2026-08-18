import { createUserSchema } from "../../schemas/user/createSchemas";
import UserService from "../../services/user/createUser";
import { Request } from "../../types/custom-handler";

const create = async (req: Request<{ body: typeof createUserSchema }>) => {
  const data = req.body;
  const userService = new UserService();
  const user = await userService.createUser(data);
  return { result: { data: user, message: "User Created succesfully" } };
}

export default { create };
