import dbConnect from "@/lib/db";
import userModel from "@/model/user";
import {z} from "zod";
import {userNameValidation} from "@/Schemas/SignUpShema"


const userValidationSchema=z.object({
    username:userNameValidation
})
export async function GET(request:Request) {


     await dbConnect()
     try{
        const {searchParams}= new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }
        const result=userValidationSchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            return Response.json({
                success:false,
                message:'Invalid Username'
            },{status:400})
        }
        const {username}=result.data
        const existingUser=await userModel.findOne({username,isautherized:true})
        if(existingUser){
            return Response.json({
                success:false,
                message:'Username Already Taken'
            },{status:400})
        }
        return Response.json({
            success:true,
            message:'username is avaliable'
        },{status:201})

     }
     catch(error){
        console.error("Error Checking Username",error)
        return Response.json({
            success:false,
            message:'Error checking usernamr'
        },{
            status:400
        })
     }
}

