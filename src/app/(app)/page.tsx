"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import value from "../../../message.json" 
import { Card, CardContent} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
export default function Home() {
   const [name,setname]=React.useState("")
   const {toast}=useToast()
   const Router=useRouter()
    const plugin = React.useRef(
    Autoplay({ delay: 2000})
    )
    const handleChange= (event:React.ChangeEvent<HTMLInputElement>)=>{
        setname(event.target.value)
    }
    const handleSubmit=()=>{
      if(name===""){
        toast({
          title:"Name not be empty",
          variant:'destructive'
        })
        return
      }
      Router.replace(`/u/${name}`)
    }
  return (
     <div className="bg-slate-800 h-auto text-white">
       <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 mt-6">
             Dive In The World Of <br/>Mystery Message
          </h1>
          <p className="mb-4">Enter Your Friends/Realative Name and Start
            Sending messages to them...
          </p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs text-black ml-2 md:ml-40"
      
    >
      <CarouselContent>
        {value.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-0.5">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel> 
    <div className="flex w-full max-w-sm items-center space-x-2 text-black">
      <Input type="email" placeholder="Enter relative/friend Name" onChange={handleChange}/>
      <Button onClick={handleSubmit}>Send Messages</Button>
    </div>
    </div>
    <footer className='mt-6 position:absolute bottom-0 p-4 shadow-md bg-slate-950 text-white w-full text-center '>
    Created By Mehul Kumar| Copyright @2024
    </footer>
    </div>     
       
  )
}
