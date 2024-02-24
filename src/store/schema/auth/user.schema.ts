import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interfaces/auth/user.interface";



export const userSchema = new mongoose.Schema<IUser>(
    {
        Name: {
            type: String,
            required: true,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        roleToken: {
            type: Schema.Types.ObjectId,
            required: false,
            default: new mongoose.Types.ObjectId("65300d1c64d4f39fd4e2a371"),
            ref: "AccessToken",
        },
        resetPasswordToken: {
            type: String,
            required: false,
        },
        resetPasswordExpires: {
            type: Date,
            required: false,
        },
        firebaseToken: {
            type: String,
            required: true,
        },
        points:{
            type: Number,
            required: false,
            default: 0
        },
        github:{
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);
