"use strict";
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
    static async resetPassword({ emailId }) {
        try {
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error('Unable to connect to Auth db');
            }
            const searchFilter = emailId ? { emailId } : null;
            const user = await authDBModels.User.findOne(searchFilter).lean();
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
    }
}
exports.PasswordResetHelper = PasswordResetHelper;
