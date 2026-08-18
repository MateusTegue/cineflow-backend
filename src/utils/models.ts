export enum status {
    ACTIVE = "Activo",
    INACTIVE = "Inactivo"
}

export enum role {
    SUPER_ADMIN = "Super Administrador",
    ADMIN = "Administrador",
    USER = "Usuario"
}

export interface authBody {
    email: string;
    password: string;
}




export enum StyleCategory {
  ART = "art",
  PHOTOGRAPHY = "photography",
  ILLUSTRATION = "illustration",
  ABSTRACT = "abstract",
  FANTASY = "fantasy",
  SCI_FI = "sci-fi",
  CARTOON = "cartoon",
  REALISTIC = "realistic",
}

export enum GenerationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum ImageAspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "2:3",
  LANDSCAPE = "3:2",
  WIDE = "16:9",
  TALL = "9:16",
}

export enum ImageQuality {
  STANDARD = "standard",
  HD = "hd",
  UHD = "4k",
}

export interface GenerationParameters {
  temperature?: number; // Creatividad (0-1)
  steps?: number; // Número de pasos de difusión
  cfgScale?: number; // Guidance scale
  seed?: number; // Semilla para reproducibilidad
  sampler?: string; // Método de muestreo
  model?: string; // Modelo específico a usar (DALL-E 3, SDXL, Midjourney, etc.)
  negativePrompt?: string;
  [key: string]: any;
}