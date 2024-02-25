import { Request, Response } from "express";
import {
    userIdentificationValidatorSchema,
    userValidatorSchema,
} from "../../validators/userInfo.validator";
import {
    userLoginValidatorSchema
} from "../../validators/userLogin.validator";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { IUser } from "../../store/interfaces/auth/user.interface";
import { IError } from "../../store/interfaces/response/error";
import { IResponse } from "../../store/interfaces/response/success";
import { LoginRegisterHelper } from "../helper";
import { LogRequestResponse } from "../../store/logger/pino";

export class LoginRegisterController {
    @LogRequestResponse()
    static async Register(req: Request, res: Response) {
        try {
            const data: IUser = await userValidatorSchema.validateAsync(
                req.body
            );
            

            const userInfo: IUser = await LoginRegisterHelper.RegisterHelper(
                data
            );
        

            const response: IResponse = {
                data: {
                    ...userInfo,
                    password: undefined,
                    firebaseToken: undefined,
                },
                message: "User Registered Successfully",
            };

            return res.status(EHTTPS_RESPONSE_CODE.CREATED_OK).json(response);
        } catch (error) {
            let response: IError = {
                data: [],
                message: error.message,
                meta: {
                    error: true,
                },
            };

            if (error.message.includes("duplicate key error collection")) {
                response.message = "User already exists";
                return res
                    .status(
                        error.statusCode
                            ? error.statusCode
                            : EHTTPS_RESPONSE_CODE.SERVER_ERROR
                    )
                    .json(response);
            }
            return res
                .status(
                    error.statusCode
                        ? error.statusCode
                        : EHTTPS_RESPONSE_CODE.SERVER_ERROR
                )
                .json(response);
        }
    }

    @LogRequestResponse()
   static async Login(req: Request, res: Response) {
    try {
        const { emailId, password } =
            await userLoginValidatorSchema.validateAsync(req.body);

        const { user, bearerToken } =
            await LoginRegisterHelper.LoginHelper({
                emailId,
                password
            });
            
        res.status(EHTTPS_RESPONSE_CODE.OK).json({
            token: user._id,
            bearerToken,
            data: {
                Name: user.Name,
                emailId: user.emailId,
                points: user.points,
                github: user.github,
            },
        });
    } catch (error) {
        let response: IError = {
            data: [],
            message: error.message,
            meta: {
                error: true,
            },
        };
        return res
            .status(
                error.statusCode
                    ? error.statusCode
                    : EHTTPS_RESPONSE_CODE.SERVER_ERROR
            )
            .json(response);
    }
}



    @LogRequestResponse()
    static async checkTokenExpiryController(req: Request, res: Response) {
        try {
            const { token } = req.params;

            const notExpired = await LoginRegisterHelper.checkTokenExpiryHelper(
                token
            );
            const response: IResponse = {
                data: {
                    isExpired: !notExpired,
                },
                message: "Token Expiry Status",
            };
            return res
                .status(
                    notExpired
                        ? EHTTPS_RESPONSE_CODE.OK
                        : EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                )
                .json(response);
        } catch (error) {
            let response: IError = {
                data: [],
                message: error.message,
                meta: {
                    error: true,
                },
            };
            return res
                .status(
                    error.statusCode
                        ? error.statusCode
                        : EHTTPS_RESPONSE_CODE.SERVER_ERROR
                )
                .json(response);
        }
    }

    @LogRequestResponse()
    static async resetPasswordController(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const isReset = await LoginRegisterHelper.resetPasswordHelper({
                token,
                password,
            });
            const response: IResponse = {
                data: {
                    isReset,
                },
                message: "Password Reset Status",
            };
            return res
                .status(
                    isReset
                        ? EHTTPS_RESPONSE_CODE.OK
                        : EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                )
                .json(response);
        } catch (error) {
            let response: IError = {
                data: [],
                message: error.message,
                meta: {
                    error: true,
                },
            };

            return res
                .status(
                    error.statusCode
                        ? error.statusCode
                        : EHTTPS_RESPONSE_CODE.SERVER_ERROR
                )
                .json(response);
        }
    }

    @LogRequestResponse()
    static async createResetUrlController(req: Request, res: Response) {
        try {
            const data = await userIdentificationValidatorSchema.validateAsync(
                req.body
            );

            const resetUrl = await LoginRegisterHelper.createResetUrlHelper({
                emailId: data.emailId,
            });

            const response: IResponse = {
                data: {
                    resetUrl,
                },
                message: "Reset Url",
            };
            return res.status(EHTTPS_RESPONSE_CODE.OK).json(response);
        } catch (error) {
            let response: IError = {
                data: [],
                message: error.message,
                meta: {
                    error: true,
                },
            };

            return res
                .status(
                    error.statusCode
                        ? error.statusCode
                        : EHTTPS_RESPONSE_CODE.SERVER_ERROR
                )
                .json(response);
        }
    }
}
