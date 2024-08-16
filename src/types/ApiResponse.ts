import {message} from "@/model/user" 

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean;
    messages?: Array<message>
}