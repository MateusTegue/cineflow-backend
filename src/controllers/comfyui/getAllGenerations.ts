import GetAllGenerationsService from "../../services/comfyui/getAllGenerations";

const getAll = async () => {
  const service = new GetAllGenerationsService();
  const generations = await service.getAllGenerations();
  return { result: { data: generations, message: "Generations retrieved successfully" } };
}

export default { getAll };