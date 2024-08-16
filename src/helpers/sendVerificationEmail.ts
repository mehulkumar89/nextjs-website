import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import {ApiResponse} from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    passcode:string

):Promise<ApiResponse>{
    try{
            await resend.emails.send({
            from: 'mehulkr1801@gmail.com',
            to: email,
            subject: 'verification Code',
            react: VerificationEmail({ username,otp:passcode}),
          });
          
        return{
            success:true,
            message:'send verification email Successfully'
          }
    }
    catch(emailError){
      console.error('error Sending verification email',emailError)

      return{
        success:false,
        message:'Failed to send verification email'
      }
    }
}