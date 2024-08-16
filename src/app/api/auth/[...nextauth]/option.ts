import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import userModel from "@/model/user";
import dbConnect from "@/lib/db";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try{
                  const user=await userModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                  })
                  if(!user){
                    throw new Error("No user found with this email")
                  }
                  if(!user.isautherized){
                    throw new Error("please verify your account before login")
                  }
                  const ispasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                  if(ispasswordCorrect){
                    return user
                  }
                  else{
                    throw new Error("Incorrect Password")
                  }
                }
                catch(err:any){
                    throw new Error(err)
                }
                
              }
        })
    ],
    callbacks:{
          async jwt({ token, user }) {
            if(user){
            token._id=user._id?.toString()
            token.isautherized=user.isautherized;
            token.isAcceptingMessage=user.isAcceptingMessage
            token.username=user.username
            }
            return token
          },
          async session({ session, token}) {

            if(token){
              session.user._id=token._id
              session.user.isAcceptingMessage=token.isAcceptingMessage
              session.user.isautherized=token.isautherized
              session.user.username=token.username
            }
            return session
          }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.SECRET_KEY
}