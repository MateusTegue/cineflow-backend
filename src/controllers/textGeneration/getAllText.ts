import TextGenerationService from "../../services/textGeneration/getAllText";

const getAllText = async () => {
    const textGenerationService = new TextGenerationService();
    const texts = await textGenerationService.getAll();
    return { result: { data: texts, message: "Get texts successfully" } };
}

export default { getAllText };