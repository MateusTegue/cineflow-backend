import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseAttributes } from "../../services";
import { GenerationStatus, ChatRole } from "../../utils/models";
import type { TextGenerationParameters } from "../../utils/models";
import { User } from "./user";

@Entity("text_generations")
export class TextGeneration extends BaseAttributes {
  @Column({ type: "varchar", length: 255, nullable: true })
  conversationId?: string;

  @Column({ type: "text", nullable: false })
  prompt!: string;

  @Column({ type: "text", nullable: true })
  response?: string;

  @Column({ type: "text", nullable: true })
  systemPrompt?: string;

  @Column({ type: "varchar", length: 100, default: "gpt-4o" })
  model!: string;

  @Column({
    type: "enum",
    enum: ChatRole,
    default: ChatRole.USER,
  })
  role!: ChatRole;

  @Column({
    type: "enum",
    enum: GenerationStatus,
    default: GenerationStatus.PENDING,
  })
  status!: GenerationStatus;

  @Column({ type: "float", nullable: true, default: 0.7 })
  temperature?: number;

  @Column({ type: "integer", nullable: true })
  maxTokens?: number;

  @Column({ type: "integer", nullable: true })
  promptTokens?: number;

  @Column({ type: "integer", nullable: true })
  completionTokens?: number;

  @Column({ type: "integer", nullable: true })
  totalTokens?: number;

  @Column({ type: "integer", nullable: true })
  generationTimeMs?: number;

  @Column({ type: "text", nullable: true })
  errorMessage?: string;

  @Column({ type: "jsonb", nullable: true })
  parameters?: TextGenerationParameters;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "userId" })
  user?: User;
}
