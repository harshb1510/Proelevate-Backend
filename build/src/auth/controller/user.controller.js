"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoController = void 0;
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const userInfo_validator_1 = require("../../validators/userInfo.validator");
const user_helper_1 = require("../helper/user.helper");
const pino_1 = require("../../store/logger/pino");
class UserInfoController {
    static async getUserInfo(req, res) {
        try {
            const data = await userInfo_validator_1.userIdentificationValidatorSchema.validateAsync(req.query);
            const userInfo = await user_helper_1.UserInfoHelper.getUserInfo(data);
            const responseObj = {
                message: "User details fetched successfully!",
                data: userInfo,
            };
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(responseObj);
        }
        catch (error) {
            const response = {
                message: error.message,
                data: [],
                meta: {
                    error: true,
                },
            };
            return res.status(error.statusCode ? error.statusCode : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json(response);
        }
    }
    static async updateInfo(req, res) {
        try {
            const data = await userInfo_validator_1.userUpdationValidationSchema.validateAsync(req.body);
            const userInfo = await user_helper_1.UserInfoHelper.amendUserInfo(data);
            const responseObj = {
                message: "User details updated successfully!",
                data: userInfo,
            };
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(responseObj);
        }
        catch (error) {
            const response = {
                message: error.message,
                data: [],
                meta: {
                    error: true,
                },
            };
            return res.status(error.statusCode ? error.statusCode : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json(response);
        }
    }
    static async getUsersByPointsAscending(req, res) {
        try {
            const users = await user_helper_1.UserInfoHelper.getUsersByPointsAscending();
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(users);
        }
        catch (error) {
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }
}
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "getUserInfo", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "updateInfo", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "getUsersByPointsAscending", null);
exports.UserInfoController = UserInfoController;
