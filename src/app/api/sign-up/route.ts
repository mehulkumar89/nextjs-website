import dbConnect from "@/lib/db";
import userModel from "@/model/user";

import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/nodemailer";

export async function POST(request:Request){
 await dbConnect()
 try{
   const {username,email,password}=await request.json()
   const existingUser=await userModel.findOne({
    username,
    isautherized:true
   })
   if(existingUser){
    return Response.json({
        success:false,
        message:'Username already exits'
    },{status:400})
   }
   const existingUserbyEmail=await userModel.findOne({email})
   const hashpassword=await bcrypt.hash(password,10)
   const passCode=(Math.floor(100000 + Math.random() * 900000)).toString()
   const expiry=new Date()
   expiry.setHours(expiry.getHours()+1)

   if(existingUserbyEmail){
        if(existingUserbyEmail.isautherized){
            return Response.json({
                success:false,
                message:'user already exits with this email'
            },{status:400})
        }
        else{
           existingUserbyEmail.password=hashpassword
           existingUserbyEmail.passCode=passCode
           existingUserbyEmail.ExpirypassCode=expiry
           await existingUserbyEmail.save()
        }
   }
   else{
       const user=new userModel({
        username,
        email,
        password:hashpassword,
        messages:[],
        passCode,
        isAcceptingMessage:true,
        ExpirypassCode:expiry,
        isautherized:false
      })
      await user.save()
   }
   const emailsender=await sendVerificationEmail(email,username,passCode)
   if(emailsender.success){
    return Response.json({
        success:true,
        message:'User Registered Succesfully'
    },{status:201})
   }
   else{
    return Response.json({
        success:false,
        message:emailsender.message
    },{status:400})
   }
 }
 catch(error){
    console.error('Error registering user',error)
    return Response.json(
        {
            success:false,
            messsage:"Error registring user"
        },
        {
            status:500
        }
    )
 }
}