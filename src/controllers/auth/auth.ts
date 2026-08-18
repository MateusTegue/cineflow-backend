import { Request } from "../../types/custom-handler";
import { authService } from "../../services/auth/auth";
import { loginSchema } from "../../schemas/auth/authSchemas";


const login = async (
    req: Request<{ body: typeof loginSchema }>
) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return {
        result: {
            data: result,
            message: 'Login successful',
        },
    };
};

export default { login };
