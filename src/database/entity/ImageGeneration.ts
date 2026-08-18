import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseAttributes } from "../../services";
import { GenerationStatus, ImageAspectRatio, ImageQuality } from "../../utils/models";
import { ImageStyle } from "./ImageStyle";
import type { GenerationParameters } from "../../utils/models";

@Entity("image_generations")
export class ImageGeneration extends BaseAttributes {
  @Column({ type: "text", nullable: false })
  prompt!: string;

  @Column({ type: "text", nullable: true })
  revisedPrompt?: string;

  @Column({ type: "text", nullable: true })
  negativePrompt?: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  imageUrl?: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  thumbnailUrl?: string;

  @Column({
    type: "enum",
    enum: GenerationStatus,
    default: GenerationStatus.PENDING,
  })
  status!: GenerationStatus;

  @Column({
    type: "enum",
    enum: ImageAspectRatio,
    default: ImageAspectRatio.PORTRAIT,
  })
  aspectRatio!: ImageAspectRatio;

  @Column({
    type: "enum",
    enum: ImageQuality,
    default: ImageQuality.STANDARD,
  })
  quality!: ImageQuality;

  @Column({ type: "integer", default: 1024 })
  width!: number;

  @Column({ type: "integer", default: 1024 })
  height!: number;

  @Column({ type: "integer", nullable: true })
  generationTimeMs?: number;

  @Column({ type: "text", nullable: true })
  errorMessage?: string;

  @Column({ type: "jsonb", nullable: true })
  parameters?: GenerationParameters;

  @ManyToOne(() => ImageStyle, (style) => style.generations, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "styleId" })
  style?: ImageStyle;
}