import mongoose, {Schema,Document} from "mongoose";

export interface message extends Document{
    content:string,
    createdAt:Date
}

const messageSchema:Schema<message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    messages:message[],
    passCode:string,
    createdAt:Date,
    isAcceptingMessage:boolean,
    ExpirypassCode:Date,
    isautherized:boolean
}

const userSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        trim:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,
        trim:true,
        required:[true,'Email is required'],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Enter valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    passCode:{
        type:String,
        required:[true,'PassCode is required'],
    },
    ExpirypassCode:{
        type:Date,
        required:[true,'ExpirypassCode is required']
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    isautherized:{
        type:Boolean,
        default:false
    },
    messages:[messageSchema]
})

const userModel= (mongoose.models.User as mongoose.Model<User>) || 
(mongoose.model<User>('User',userSchema))

export default userModel