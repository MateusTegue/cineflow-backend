import { paramsId } from "../../schemas";
import TextGenerateService from "../../services/textGeneration/deleteTextGenerate";
import { Request } from "../../types/custom-handler";

const deleteTextGenerate = async (req: Request<{ params: typeof paramsId }>) => {
  const textGenerateService = new TextGenerateService();
  await textGenerateService.deleteTextGenerate(req.params.id);
  return { result: { message: 'Text generation deleted successfully' } };
}

export default { deleteTextGenerate };