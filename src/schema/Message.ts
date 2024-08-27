import { timeStamp } from 'console';
import z from 'zod';

export const messageSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string().max(2000, 'Cannot send more than 200 character'),
    timeStamp: z.number(),
})

export const messageArrayValidator = z.array(messageSchema);

export type Message = z.infer<typeof messageSchema>;