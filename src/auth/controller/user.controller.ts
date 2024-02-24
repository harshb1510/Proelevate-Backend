import { Response } from "express";
import { IAuth } from "../../store/interfaces/auth/AuthenticationRequest.interface";
import { IError } from "../../store/interfaces/response/error";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { userIdentificationValidatorSchema, userUpdationValidationSchema } from "../../validators/userInfo.validator";
import { IAuthUser } from "../../store/interfaces/auth/user.interface";
import { UserInfoHelper } from "../helper/user.helper";
import { IResponse } from "../../store/interfaces/response/success";
import { IUser } from "../../store/interfaces/auth/user.interface";
import { LogRequestResponse } from "../../store/logger/pino";

export class UserInfoController {
    @LogRequestResponse()
    static async getUserInfo(req: IAuth, res: Response) {
        try {
            const data = await userIdentificationValidatorSchema.validateAsync(req.query);

            const userInfo: IAuthUser = await UserInfoHelper.getUserInfo(data);

            const responseObj: IResponse = {
                message: "User details fetched successfully!",
                data: userInfo,
            };

            return res.status(EHTTPS_RESPONSE_CODE.OK).json(responseObj);
        } catch (error) {
            const response: IError = {
                message: error.message,
                data: [],
                meta: {
                    error: true,
                },
            };

            return res.status(error.statusCode ? error.statusCode : EHTTPS_RESPONSE_CODE.SERVER_ERROR).json(response);
        }
    }
    
    @LogRequestResponse()
    static async updateInfo(req: IAuth, res: Response) {
        try {
            const data = await userUpdationValidationSchema.validateAsync(req.body);

            const userInfo = await UserInfoHelper.amendUserInfo(data);

            const responseObj: IResponse = {
                message: "User details updated successfully!",
                data: userInfo,
            };

            return res.status(EHTTPS_RESPONSE_CODE.OK).json(responseObj);
        } catch (error) {
            const response: IError = {
                message: error.message,
                data: [],
                meta: {
                    error: true,
                },
            };

            return res.status(error.statusCode ? error.statusCode : EHTTPS_RESPONSE_CODE.SERVER_ERROR).json(response);
        }
    }

    @LogRequestResponse()
    static async getUsersByPointsAscending(req: IAuth, res: Response) {
        try {
            const users: IUser[] = await UserInfoHelper.getUsersByPointsAscending();

            return res.status(EHTTPS_RESPONSE_CODE.OK).json(users);
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }


}
