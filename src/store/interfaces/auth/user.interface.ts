import mongoose from "mongoose";


export interface IUser {
    _id?: mongoose.Types.ObjectId | String;
    Name: string;
    emailId: string;
    password: string;
    roleToken?: mongoose.Types.ObjectId;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    firebaseToken: string;
    github?: string;
    points?: number;
}

export interface IAuthUser {
    _id: String;
    Name: string;
    emailId: string;
    roleToken?: mongoose.Types.ObjectId;
}

export interface ILikeRequest {
    userId: string; 
    likedUserId: string;
}