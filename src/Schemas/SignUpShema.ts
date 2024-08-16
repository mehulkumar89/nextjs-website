import {z} from "zod"

export const userNameValidation=z
.string()
.min(4,"minimum name of length 4 is required")
.max(20,"maximum length of name is 20")
.regex(/^[a-zA-Z]{4,20}$/)

export const SignupSchema=z.object({
    username:userNameValidation,
    email:z.string().email({message:'invalid email address'}),
    password:z.string().min(6,{message:'password length must be  length 6'})
})

