'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { SignupSchema } from "@/Schemas/SignUpShema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
const page = () => {
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernamemessage]=useState('')
  const [isCheckingUsername,setIsChekingUsername]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)
  const debounced=useDebounceCallback(setUsername,500)
  const { toast } = useToast()
  const router=useRouter()

  const form=useForm({
    resolver:zodResolver(SignupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

   useEffect(()=>{
     const checkUsernameUnique= async ()=>{
       if(username){
          setIsChekingUsername(true)
          setUsernamemessage('')
          try{
             const Response=await axios.get(`/api/check-username?username=${username}`)
             setUsernamemessage(Response.data.message)
          }
          catch(error){
             const axiosError=error as AxiosError<ApiResponse>
             setUsernamemessage(
              axiosError.response?.data.message ?? "Error Checking username"
             )
          } finally{
            setIsChekingUsername(false) 
          }
       }
     }
     checkUsernameUnique()
   },[username])

   const onSubmit= async (data:z.infer<typeof SignupSchema>)=>{
      setIsSubmitting(true)
      try{
        const response=await axios.post<ApiResponse>('/api/sign-up',data)
        toast({
          title:'Success',
          description:response.data.message
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch(error){
         console.error("error is signup of user",error)
         const axiosError=error as AxiosError<ApiResponse>
         let errorMessage=axiosError.response?.data.message
         toast({
          title:"Signup failed",
          description: errorMessage,
          variant:"destructive"
         })
         setIsSubmitting(false)
      }
   }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
         <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
               Join Mystery Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
         </div>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              { isCheckingUsername && <Loader2 className="animate-spin"/>}
              <p className={usernameMessage==="username is avaliable" ? "text-green-500":"text-red-600"}>
              {usernameMessage}
              </p>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" 
                {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" 
                {...field} 
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
           isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              please Wait
              </>
           ):('Signup') 
          }
           
        </Button>
           </form>
         </Form>
         <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>

         </div>
      </div>
    </div>
  )
}

export default page