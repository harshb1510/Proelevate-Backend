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
exports.PasswordResetHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const customError_1 = require("../../store/error/customError");
const authConnection_1 = require("../../DB/authConnection");
class PasswordResetHelper {
    static resetPassword({ emailId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
                if (!success) {
                    throw new Error('Unable to connect to Auth db');
                }
                const searchFilter = emailId ? { emailId } : null;
                const user = yield authDBModels.User.findOne(searchFilter).lean();
                if (!user) {
                    throw new customError_1.CustomError('User not found', responseCode_enum_1.EHTTPS_RESPONSE_CODE.NOT_FOUND);
                }
                // Creating JWT token
                const userInfo = {
                    _id: user._id.toString(),
                    Name: user.Name,
                    emailId: user.emailId,
                    roleToken: user.roleToken,
                    points: user.points,
                    github: user.github
                };
                const bearerToken = jsonwebtoken_1.default.sign(userInfo, user.firebaseToken, {
                    expiresIn: '10m', // Token expires in 10 minutes
                });
                return {
                    user,
                    bearerToken,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.PasswordResetHelper = PasswordResetHelper;
