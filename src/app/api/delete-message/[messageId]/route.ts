import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option"
import dbConnect from "@/lib/db";
import userModel from "@/model/user";
import { User } from "next-auth";

export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
    dbConnect()
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
    try{
        const param=params.messageId
        const ExitingUser=await userModel.updateOne({_id:user._id},{$pull:
            {
                messages:{
                    _id:param
                }
            }
        })
        if(ExitingUser.modifiedCount==0){
            Response.json({
                success:false,
                message:'user already deleted or not found'
            },{status:400})
        }
        return (
            Response.json({
                success:true,
                message:'message deleted Succefully'
            },{status:200})
        )

    }catch(error){
        console.log("error while deleting message",error)
        return (
            Response.json({
                success:false,
                message:'error deleting message'
            },{status:400})
        )
    }

}