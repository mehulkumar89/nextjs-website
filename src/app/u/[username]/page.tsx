'use client'
import * as z  from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter,useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MessageSchema } from '@/Schemas/messageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
const page = () => {

  const router=useRouter()
  const Param=useParams<{username:string}>()
  const [isSubmitting,setSubmitting]=useState(false)
  const form=useForm({
    resolver:zodResolver(MessageSchema),
    defaultValues:{
      content:''
    }
  })
  const onSubmit=async (data:z.infer<typeof MessageSchema>)=>{
      setSubmitting(true)
      try{
        const response= await axios.post<ApiResponse>('/api/send-messages',{
          username:Param.username,
          content:data.content
         })
         toast({
          title:"Success",
          description:response.data.message
         })
         router.replace('/')
      } catch(error){
        console.error("error while Sending Message",error)
        const axiosError=error as AxiosError<ApiResponse>
        console.log(axiosError)
         toast({
         title:"Error",
         description: axiosError.response?.data.message,
         variant:"destructive"
        })
      } finally{
        setSubmitting(false)
      }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
       <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
             Send Messages
          </h1>
          <p className="mb-4">Enter the Message which is sent to {Param.username}</p>
         </div>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>  
         
    <FormField
         control={form.control}
        name="content"
        render={({ field }) => (
    <FormItem>
      <FormLabel>Content</FormLabel>
      <FormControl>
      <Textarea placeholder="Type your message here." {...field}/>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
 <Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 
  (<>
  <Loader2 className='animate-spin mr-2 h-4 w-4'/> 
  Sending... </>):('Send')}
 </Button>
  </form>
 </Form>
 </div>
</div>
  
  )

}

export default page