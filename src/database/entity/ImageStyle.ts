import { Column, Entity, OneToMany } from "typeorm";
import { BaseAttributes } from "../../services";
import { StyleCategory } from "../../utils/models";
import { ImageGeneration } from "./ImageGeneration";

@Entity("image_styles")
export class ImageStyle extends BaseAttributes {
  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "text", nullable: false })
  promptTemplate!: string;

  @Column({ type: "text", nullable: true })
  negativePrompt!: string;

  @Column({
    type: "enum",
    enum: StyleCategory,
    default: StyleCategory.ART,
  })
  category!: StyleCategory;

  @Column({ type: "varchar", length: 500, nullable: true })
  previewUrl!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => ImageGeneration, (generation) => generation.style)
  generations!: ImageGeneration[];
}
