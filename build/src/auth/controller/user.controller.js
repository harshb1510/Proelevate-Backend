"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoController = void 0;
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const userInfo_validator_1 = require("../../validators/userInfo.validator");
const user_helper_1 = require("../helper/user.helper");
const pino_1 = require("../../store/logger/pino");
class UserInfoController {
    static getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userInfo_validator_1.userIdentificationValidatorSchema.validateAsync(req.query);
                const userInfo = yield user_helper_1.UserInfoHelper.getUserInfo(data);
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
        });
    }
    static updateInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userInfo_validator_1.userUpdationValidationSchema.validateAsync(req.body);
                const userInfo = yield user_helper_1.UserInfoHelper.amendUserInfo(data);
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
        });
    }
    static getUsersByPointsAscending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_helper_1.UserInfoHelper.getUsersByPointsAscending();
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(users);
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
}
exports.UserInfoController = UserInfoController;
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "getUserInfo", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "updateInfo", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], UserInfoController, "getUsersByPointsAscending", null);
