import * as dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createAuthDbConnection } from "../DB/authConnection";
import { EHTTPS_RESPONSE_CODE } from "../store/enums/HTTP_Response_Code/responseCode.enum";
import { IAuth } from "../store/interfaces/auth/AuthenticationRequest.interface";
import { IUser } from "../store/interfaces/auth/user.interface";
import { CustomError } from "../store/error/customError";
dotenv.config();

export function authenticateToken(roles = ["USER"]) {
  return async (
    req: IAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!roles.includes("NOT_VALIDATED")) {
        let bearerToken = req.header("Authorization");
        const token = req.header("token");

        if (!bearerToken) {
          throw new CustomError("Authorization Missing", EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
        }

        bearerToken = bearerToken.replace("Bearer ", "");

        if (!token) {
          throw new CustomError("Token Missing", EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
        }

        const { success, authDBModels } = createAuthDbConnection();

        if (!success) {
          throw new CustomError("🔴 DB Connection Failed!")
        }

        let user: IUser = await authDBModels.User.findOne({
          _id: new mongoose.Types.ObjectId(token),
        });

        if (!user) {
          throw new CustomError("User not found", EHTTPS_RESPONSE_CODE.NOT_FOUND);
        }
        
        jwt.verify(bearerToken, user.firebaseToken, (err, user) => {
          if (err) {
            throw new CustomError("Invalid Token", EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
          }
          next();
        });
      } else {
        next();
      }
    } catch (err) {
      return res.status(err.statusCode ? err.statusCode : EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS).json({
        error: {
          message: "Error from auth: " + err.message
        }
      })
    }
  }
}
