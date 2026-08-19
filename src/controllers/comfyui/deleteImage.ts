import { paramsId } from "../../schemas";
import ImageService from "../../services/comfyui/deleteImage";
import { Request } from "../../types/custom-handler";

const deleteImage = async (req: Request<{ params: typeof paramsId }>) => {
    const imageService = new ImageService();
    await imageService.deleteImage(req.params.id);
    return { result: { message: "Image deleted successfully" } };
}
export default { deleteImage };