import { z } from "zod";

export const SignInSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'username must be valid string'
    }).min(6,'Username must be of 6 characters'),
    password: z.string({required_error: 'Password is required'}).min(8, 'Password must be of 8 characters')
})