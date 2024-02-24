"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoHelper = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authConnection_1 = require("../../DB/authConnection");
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const customError_1 = require("../../store/error/customError");
const updateUser_builder_1 = require("../logics/updateUser.builder");
const userInfo_builder_1 = require("../logics/userInfo.builder");
class UserInfoHelper {
    static getUserInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfoQuery = new userInfo_builder_1.UserInfoFetchBuilder()
                    .addEmail(data.emailId)
                    .addId(data._id)
                    .buildQuery();
                const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
                if (!success) {
                    throw new Error("Unable to connect to Auth db");
                }
                let userDetails = yield authDBModels.User.findOne(userInfoQuery)
                    .populate("roleToken")
                    .lean()
                    .select(["-password", "-firebaseToken", "-updatedAt", "-__v"]);
                if (!userDetails) {
                    throw new customError_1.CustomError("No user found with the given user info", responseCode_enum_1.EHTTPS_RESPONSE_CODE.NOT_FOUND);
                }
                return Object.assign(Object.assign({}, userDetails), { access: userDetails.roleToken["access"], roleToken: undefined });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static amendUserInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
                if (!success) {
                    throw new Error("Unable to connect to Auth db");
                }
                let user = yield authDBModels.User.findOne({ _id: data._id });
                if (!user) {
                    throw new customError_1.CustomError("Unable to find user", responseCode_enum_1.EHTTPS_RESPONSE_CODE.NOT_FOUND);
                }
                if (data.password) {
                    if (!(yield bcrypt_1.default.compare(data.previousPassword, user.password))) {
                        throw new customError_1.CustomError("Incorrect previous password", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
                    }
                }
                user = new updateUser_builder_1.UpdateUserQueryBuilder(data, user)
                    .setPassword()
                    .getQuery();
                const updatedUser = yield user
                    .updateOne(user, { new: true, upsert: true, timestamps: false })
                    .lean();
                if (updatedUser.matchedCount < 1) {
                    throw new Error("Failed to update");
                }
                return { count: updatedUser.matchedCount };
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUsersByPointsAscending() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
                if (!success) {
                    throw new Error("Unable to connect to Auth db");
                }
                const users = yield authDBModels.User.find()
                    .sort({ points: 1 })
                    .lean()
                    .select(["-password", "-firebaseToken", "-updatedAt", "-__v"]);
                if (!users) {
                    throw new customError_1.CustomError("No users found", responseCode_enum_1.EHTTPS_RESPONSE_CODE.NOT_FOUND);
                }
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserInfoHelper = UserInfoHelper;
