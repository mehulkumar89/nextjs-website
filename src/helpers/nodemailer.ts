import nodemailer from 'nodemailer'
import {ApiResponse} from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    passcode:string

):Promise<ApiResponse>{
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
      
        const text = `${username} Your One-Time Password (OTP) is: ${passcode}\n\nPlease use this OTP to complete your Registration.\n It is valid for Only 1 hours`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:email,
            subject:'User verification',
            text,
        });
        return{
            success:true,
            message:'send verification email Successfully'
          }  
    }
    catch(error){
     console.error('error Sending verification email',error)
      return{
        success:false,
        message:'Failed to send verification email'
      }
    }
}