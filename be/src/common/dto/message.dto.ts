import { createZodDto } from "nestjs-zod";
import z from "zod";

export const MessageSchema = z.object({
  message: z.string(),
})

export class MessageDto extends createZodDto(MessageSchema) {}

