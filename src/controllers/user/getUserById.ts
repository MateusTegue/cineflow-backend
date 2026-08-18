import { paramsId } from "../../schemas";
import UserService from "../../services/user/getUserById";
import { Request } from "../../types/custom-handler";

const getUserById = async (req: Request<{ params: typeof paramsId }>) => {
    const userId = req.params.id;
    const userService = new UserService();
    const user = await userService.getUserById(userId);
    return { result: { data: user, message: 'Get user succesfully' } };
};

export default { getUserById };