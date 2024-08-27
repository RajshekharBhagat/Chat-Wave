import { z } from "zod";

export const AddFriendSchema = z.object({
    email: z.string().min(1,'Email is required').email({message: 'Invalid Email Address'})
})