import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/db";
import userModel from "@/model/user";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:User=session?.user
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not authenticated"
            },
            {status:401}
        )
    }

    const userId=user._id
    const {acceptmessage}=await request.json()
    try{
      const updateUser=  await userModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptmessage},{new:true})
      if(!updateUser){
        return Response.json(
            {
                success:false,
                message:"failed to find  user and update status to accept messages"
            },
            {status:401}
        )
      }
      return Response.json(
        {
            success:true,
            message:"Message acceptance  status updated successfully",
            updateUser
        },
        {status:200}
    )
    }
    catch(errpr){
        console.error("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message:"failed to update user status to accept messages"
            },
            {status:500}
        )
    }
}

export async function GET(request:Request){
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:User=session?.user
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                messsage:"Not authenticated"
            },
            {status:401}
        )
    }

    const userId=user._id
    try{
    const foundUser=await userModel.findById(userId)
    if(!foundUser){
        return Response.json(
            {
                success:false,
                messsage:"failed to find user"
            },
            {status:401}
        )
    }
    return Response.json(
        {
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage
        },
        {status:200}
    )
}
catch(error){
    console.error("failed to check status of messages")
    return Response.json(
        {
            success:false,
            messsage:"failed to check status of messages"
        },
        {status:500}
    )
}

}