import UserService from "../../services/user/getAllUser";

const getAllUser = async () => {
  const userService = new UserService();
  const users = await userService.getAll();
  return { result: { data: users, message: "Get users successfully" } };
}

export default { getAllUser };