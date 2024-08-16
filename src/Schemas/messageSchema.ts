import {z} from "zod"


 export const MessageSchema=z.object({
    content:z
    .string()
    .min(10,{message:'message must be of length 10'})
    .max(200,{message:'message length is at most 200 words'})
})

