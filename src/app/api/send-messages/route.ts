import dbConnect from "@/lib/db";
import userModel from "@/model/user";

import {message} from "@/model/user";

export async function POST(request:Request){
    await dbConnect()
    try{
       const {username,content}=await request.json()
       const user=await userModel.findOne({username})
       if(!user){
        return Response.json({
            success:false,
            message:'User Not Found'
        },{status:404})
       }
       if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:'Not Accepting Messages'
        },{status:400})
       }
       const newMessages={content,createdAt:new Date()}
       user.messages.push(newMessages as message)
       await user.save()
        return Response.json({
            success:true,
            message:'Message Sent Successfully'
        },{status:201})
    }
    catch(error){
        console.error("Error Sending Messages",error)
        return Response.json({
            success:false,
            message:'Error Sending Messages'
        },{
            status:400
        })
    }
}