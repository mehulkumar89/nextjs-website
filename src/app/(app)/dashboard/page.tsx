'use client'

import { useToast } from "@/components/ui/use-toast"
import { message } from "@/model/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AcceptMessageSchema } from "@/Schemas/AcceptMessages"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
const UserDashboard = () => {
  const [messages,setMessages]=useState<message[]>([])
  const [isLoading,setIsLoading]=useState(false)
  const [isSwitching,setIsSwitch]=useState(false)
  const {toast} =useToast()

  const handleDeleteMessage=(messageId:string)=>{
    setMessages(messages.filter((message)=> 
      message._id!==messageId))
  }
  const {data:session}= useSession()
  const form=useForm({
    resolver:zodResolver(AcceptMessageSchema)
  })

  const {register,watch,setValue}=form
  
  const AcceptMessages=watch('acceptMessage')
  
  const fetchAcceptMessage=useCallback(async()=>{
  setIsSwitch(true)
  try{
    const response=await axios.get<ApiResponse>('/api/accept-message')
    setValue('acceptMessage',response.data.isAcceptingMessage)
  } catch(error){
    const axiosError= error as AxiosError<ApiResponse>
    toast({
      title:"error",
      description:axiosError.response?.data.message || "failed to fetch message setting",
      variant:"destructive"
    })
  }
  finally{
    setIsSwitch(false)
  }

},[setValue,toast])

  const fetchMessage= useCallback(async (refresh:boolean=false)=>{
     setIsLoading(true)
     setIsSwitch(false)
     try{
       const responce=await axios.get<ApiResponse>('/api/get-message')
       setMessages(responce.data.messages || [])
       if(refresh){
        toast({
          title:"Refreshed Message",
          description:"showing latest messages"
        })
       }
     } catch(error){
      const axiosError= error as AxiosError<ApiResponse>
      toast({
        title:"Trying to fetch Messages...",
        description:axiosError.response?.data.message || "failed to fetch message setting",
        variant:"destructive"
      })
     }
     finally{
      setIsSwitch(false)
      setIsLoading(false)
     }
  },[setIsLoading,setMessages,toast])

   useEffect(()=>{
    if(!session || !session.user) return
    fetchMessage()
    fetchAcceptMessage()
   },[session,setValue,fetchAcceptMessage,fetchMessage])
  
   const handleSwitchChange=async()=>{
    try{
      const response=await axios.post<ApiResponse>('/api/accept-message',{
        acceptmessage:!AcceptMessages
      })
      setValue('acceptMessage',!AcceptMessages)
      toast({
        title:"success",
        description:response.data.message,
      })   

    }catch(error){
      const axiosError= error as AxiosError<ApiResponse>
      toast({
        title:"error",
        description:axiosError.response?.data.message || "failed to fetch message setting",
        variant:"destructive"
      })
    }
   }

   if(!session || !session.user){
    return <div>Please Login</div>
   }

   const {username}=session.user as User
   const baseUrl=`${window.location.protocol}//${window.location.host}`
   const Url=`${baseUrl}/u/${username}`

   const clipboard=()=>{
    navigator.clipboard.writeText(Url)
    toast({
      title:'URL copied',
      description:'message copied to clipboard'
    })
   }
  
   return (
    <>
    <div className="my-8 mx-4  md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={Url}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={clipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={AcceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {AcceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessagesDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    <footer className='mt-6 position:absolute bottom-0 p-4 shadow-md bg-slate-950 text-white w-full text-center '>
    Created By Mehul Kumar| Copyright @2024
   </footer>
   </>
  )
}
 
export default UserDashboard
