import dbConnect from "@/lib/db";
import userModel from "@/model/user";

export async function POST(request:Request){
    await dbConnect()
    try{
      const {username,code}=await request.json()
      const user=await userModel.findOne({username})  
      if(!user){
        return Response.json({
            success:false,
            message:'User Not Found'
        },{status:400})
      }
      const verifyCode=user.passCode===code
      const checkExpiry=new Date(user.ExpirypassCode) > new Date()
      if(verifyCode && checkExpiry){
        user.isautherized=true;
        await user.save()
        return Response.json({
            success:true,
            message:'verify code successfully'
        },{status:200})
      }
      else if(!verifyCode){
        return Response.json({
            success:false,
            message:'code not match'
        },{status:400})
      }
      else{
        return Response.json({
            success:false,
            message:'code expires sign-up again to get the new code'
        },{status:400})
      }

    }
    catch(error){
      console.error('Error verifying code',error)
      return Response.json({
        success:false,
        message:'error verifying code'
    },{status:400})
    }
}