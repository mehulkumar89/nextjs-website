'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { SigninSchema } from "@/Schemas/signInSchema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {signIn} from "next-auth/react"
const page = () => {
  
  const [isSubmitting,setIsSubmitting]=useState(false)
  const { toast } = useToast()
  const router=useRouter()

  const form=useForm({
    resolver:zodResolver(SigninSchema),
    defaultValues:{
      identifier:'',  
      password:''
    }
  })


   const onSubmit= async (data:z.infer<typeof SigninSchema>)=>{
    setIsSubmitting(true)
     const result= await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
      if(result?.error){
        toast({
            title:"Login failed",
            description:"incorrect username or password",
            variant:"destructive"
        })
      }
      if(result?.url){
        toast({
            title:"success",
            description:"your are login succeffully",
        })
        router.replace('/dashboard')
      }
      setIsSubmitting(false)
   }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
         <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
               Join Mystery Message
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
         </div>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email or username" 
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
           ):('Signin') 
          }
         </Button>
           </form>
         </Form>
         <div className="text-center mt-4">
          <p>
             New user?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>

         </div>
      </div>
    </div>
  )
}

export default page