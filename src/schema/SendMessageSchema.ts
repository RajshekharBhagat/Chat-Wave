import { z } from "zod";

export const SendMessageSchema = z.object({
    text: z.string(),
})