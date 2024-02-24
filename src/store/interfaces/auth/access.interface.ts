import mongoose from "mongoose";
import { EAccess } from "../../enums/auth/accessToken.enum";

export interface IAccess {
    _id? : mongoose.Types.ObjectId,
    token: string,
    access: EAccess,
}