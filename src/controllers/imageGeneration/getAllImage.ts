import ImageService from "../../services/imageGeneration/getAllImage";

const getAllImage = async () => {
  const imageService = new ImageService();
  const images = await imageService.getAll();
  return { result: { data: images, message: "Get images successfully" } };
}

export default { getAllImage };