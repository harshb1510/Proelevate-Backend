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
exports.LoginRegisterController = void 0;
const userInfo_validator_1 = require("../../validators/userInfo.validator");
const userLogin_validator_1 = require("../../validators/userLogin.validator");
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const helper_1 = require("../helper");
const pino_1 = require("../../store/logger/pino");
class LoginRegisterController {
    static Register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userInfo_validator_1.userValidatorSchema.validateAsync(req.body);
                console.log(data);
                const userInfo = yield helper_1.LoginRegisterHelper.RegisterHelper(data);
                console.log(userInfo);
                const response = {
                    data: Object.assign(Object.assign({}, userInfo), { password: undefined, firebaseToken: undefined }),
                    message: "User Registered Successfully",
                };
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.CREATED_OK).json(response);
            }
            catch (error) {
                let response = {
                    data: [],
                    message: error.message,
                    meta: {
                        error: true,
                    },
                };
                if (error.message.includes("duplicate key error collection")) {
                    response.message = "User already exists";
                    return res
                        .status(error.statusCode
                        ? error.statusCode
                        : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                        .json(response);
                }
                return res
                    .status(error.statusCode
                    ? error.statusCode
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                    .json(response);
            }
        });
    }
    static Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emailId, password } = yield userLogin_validator_1.userLoginValidatorSchema.validateAsync(req.body);
                const { user, bearerToken, access } = yield helper_1.LoginRegisterHelper.LoginHelper({
                    emailId,
                    password
                });
                res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json({
                    token: user._id,
                    bearerToken,
                    data: {
                        Name: user.Name,
                        emailId: user.emailId,
                        points: user.points,
                        github: user.github,
                    },
                });
            }
            catch (error) {
                let response = {
                    data: [],
                    message: error.message,
                    meta: {
                        error: true,
                    },
                };
                return res
                    .status(error.statusCode
                    ? error.statusCode
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                    .json(response);
            }
        });
    }
    static checkTokenExpiryController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const notExpired = yield helper_1.LoginRegisterHelper.checkTokenExpiryHelper(token);
                const response = {
                    data: {
                        isExpired: !notExpired,
                    },
                    message: "Token Expiry Status",
                };
                return res
                    .status(notExpired
                    ? responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS)
                    .json(response);
            }
            catch (error) {
                let response = {
                    data: [],
                    message: error.message,
                    meta: {
                        error: true,
                    },
                };
                return res
                    .status(error.statusCode
                    ? error.statusCode
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                    .json(response);
            }
        });
    }
    static resetPasswordController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { password } = req.body;
                const isReset = yield helper_1.LoginRegisterHelper.resetPasswordHelper({
                    token,
                    password,
                });
                const response = {
                    data: {
                        isReset,
                    },
                    message: "Password Reset Status",
                };
                return res
                    .status(isReset
                    ? responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS)
                    .json(response);
            }
            catch (error) {
                let response = {
                    data: [],
                    message: error.message,
                    meta: {
                        error: true,
                    },
                };
                return res
                    .status(error.statusCode
                    ? error.statusCode
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                    .json(response);
            }
        });
    }
    static createResetUrlController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userInfo_validator_1.userIdentificationValidatorSchema.validateAsync(req.body);
                const resetUrl = yield helper_1.LoginRegisterHelper.createResetUrlHelper({
                    emailId: data.emailId,
                });
                const response = {
                    data: {
                        resetUrl,
                    },
                    message: "Reset Url",
                };
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(response);
            }
            catch (error) {
                let response = {
                    data: [],
                    message: error.message,
                    meta: {
                        error: true,
                    },
                };
                return res
                    .status(error.statusCode
                    ? error.statusCode
                    : responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR)
                    .json(response);
            }
        });
    }
}
exports.LoginRegisterController = LoginRegisterController;
__decorate([
    (0, pino_1.LogRequestResponse)()
], LoginRegisterController, "Register", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], LoginRegisterController, "Login", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], LoginRegisterController, "checkTokenExpiryController", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], LoginRegisterController, "resetPasswordController", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], LoginRegisterController, "createResetUrlController", null);
