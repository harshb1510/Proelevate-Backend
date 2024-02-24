import mongoose from "mongoose";
import { IUser } from "../interfaces/auth/user.interface";
import { IAccess } from "../interfaces/auth/access.interface";
import { userSchema } from "../schema/auth/user.schema";
import { accessSchema } from "../schema/auth/access.schema";

export const createAuthDBModels = (authDBModel: mongoose.Connection) => {
    let Access: mongoose.Model<IAccess> = authDBModel.model('AccessToken', accessSchema)
    let User: mongoose.Model<IUser> = authDBModel.model('User', userSchema);
  
    return {
      User,
      Access
    }
  }