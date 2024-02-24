import mongoose from "mongoose";
import { IAccess } from "../../interfaces/auth/access.interface";

export const accessSchema = new mongoose.Schema<IAccess> ({
    token: {
        type: String,
        required: true,
        index: true,
    }
},
{
  timestamps: true
});