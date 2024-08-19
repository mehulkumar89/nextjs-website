import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { message } from "@/model/user"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProp={
    key:string;
    message:message;
    onMessagesDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessagesDelete}:MessageCardProp) => {
    const {toast}=useToast()
    const handleDelete= async ()=>{
        try{
        const response=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessagesDelete(message._id as string)
        }
        catch(error){
            toast({
                title:'Error',
                description:'error while deleting the message',
                variant:'destructive'
            })
        }
    }
    
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <div className="relative left-48 md:left-96">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message and remove your message from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </CardHeader>
            <CardContent className="font-bold text-lg">
                {message.content}
            </CardContent>
            
        </Card>

    )
}

export default MessageCard