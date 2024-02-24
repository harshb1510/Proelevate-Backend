import { Request } from "express";
import { IAuthUser } from "./user.interface";

// Define a custom Request interface that includes a user property
export interface IAuth extends Request {
    user?: IAuthUser;
  }