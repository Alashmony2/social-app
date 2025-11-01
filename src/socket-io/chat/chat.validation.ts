import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message is too long"),
  destId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid destination ID"),
});
