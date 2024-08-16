'use client'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react' 
import * as z from 'zod'
import { verifyCode } from '@/Schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
function VerifyAccount() {
  const router=useRouter()
  const params=useParams<{username:string}>() 
  const [isSubmitting,setIsSubmitting]=useState(false) 
  const {toast}=useToast()
  const form=useForm({
    resolver:zodResolver(verifyCode),
    defaultValues:{
      code:''
    }
  })
  const onSubmit= async (data:z.infer<typeof verifyCode>)=>{
    try{
     setIsSubmitting(true) 
     const response=await axios.post(`/api/verify-code`,{
        username:params.username,
        code:data.code
     })
      toast({
       title:"success",
       description:response.data.message
      })
      router.replace('/sign-in')
    }
    catch(error){
        console.error("error while verifying code",error)
         const axiosError=error as AxiosError<ApiResponse>
         console.log(axiosError)
         toast({
          title:"Verification failed",
          description: axiosError.response?.data.message,
          variant:"destructive"
         })
    } 
    finally{
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
       <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
             Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
         </div>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>  
         <FormField
         control={form.control}
        name="code"
        render={({ field }) => (
    <FormItem>
      <FormLabel>Verification Code</FormLabel>
      <FormControl>
        <Input placeholder="code" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
 <Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 
  (<>
  <Loader2 className='animate-spin mr-2 h-4 w-4'/> 
  please wait </>):('submit')}
 </Button>
  </form>
 </Form>
 </div>
</div>
  )
}

export default VerifyAccount