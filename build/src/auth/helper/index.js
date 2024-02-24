"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRegisterHelper = void 0;
const authConnection_1 = require("../../DB/authConnection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtSecretKey_logic_1 = require("../logics/jwtSecretKey.logic");
const customError_1 = require("../../store/error/customError");
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = require("../../store/notification/sendMail");
class LoginRegisterHelper {
    static async RegisterHelper(data) {
        try {
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (success) {
                const firebaseKey = (0, jwtSecretKey_logic_1.generate32BitToken)();
                const userInfo = {
                    Name: data.Name,
                    emailId: data.emailId,
                    password: hashedPassword,
                    firebaseToken: firebaseKey,
                    github: data.github,
                };
                const user = new authDBModels.User(userInfo);
                await user.save();
                return userInfo;
            }
            else {
                throw new Error("Unable to connect to Auth db");
            }
        }
        catch (error) {
            throw error;
        }
    }
    static async LoginHelper({ emailId, password }) {
        try {
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const searchFilter = emailId
                ? { emailId }
                : null;
            const user = await authDBModels.User.findOne(searchFilter).lean();
            if (!user) {
                throw new customError_1.CustomError("User Not found", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            const access = await authDBModels.Access.findOne({
                _id: user.roleToken,
            }).lean();
            const passwordMatch = await bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new customError_1.CustomError("Authentication failed", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            const userInfo = {
                _id: user._id ? user._id.toString() : "",
                Name: user.Name,
                emailId: user.emailId,
            };
            const bearerToken = jsonwebtoken_1.default.sign(userInfo, user.firebaseToken, {
                expiresIn: "10d", // Token expires in 10 days, adjust as needed
            });
            return {
                user,
                bearerToken,
                access,
            };
        }
        catch (error) {
            throw error;
        }
    }
    static async createResetUrlHelper({ emailId }) {
        try {
            const TOKEN_EXPIRY_TIME = 15; // 15 minutes
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const searchFilter = emailId
                ? { emailId }
                : null;
            if (!searchFilter) {
                throw new customError_1.CustomError("Please provide emailId ", responseCode_enum_1.EHTTPS_RESPONSE_CODE.BAD_REQUEST);
            }
            const user = await authDBModels.User.findOne(searchFilter).lean();
            if (!user) {
                throw new customError_1.CustomError("No user found", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            const resetPasswordToken = (0, jwtSecretKey_logic_1.generate32BitToken)();
            await authDBModels.User.updateOne({ _id: user._id }, {
                resetPasswordToken,
                resetPasswordExpires: new Date(Date.now() + TOKEN_EXPIRY_TIME * 60 * 1000).toISOString(),
            });
            const resetUrl = `${process.env.RESET_PASSWORD_URL}/resetPassword?token=${resetPasswordToken}`;
            const body = `Click on the link to reset your password: <a href=${resetUrl}>Reset Password</a>`;
            const subject = "Reset Password";
            const htmlPath = path_1.default.join(__dirname, "../../store/templates/template.html");
            const htmlTemplate = fs_1.default.readFileSync(htmlPath, "utf8");
            const emailContent = { subject, body };
            const htmlToSend = (0, sendMail_1.replaceTemplate)(htmlTemplate, emailContent);
            (0, sendMail_1.sendEmail)({
                body: htmlToSend,
                destination: [user.emailId],
                subject,
            });
            return "Reset url sent to your email";
        }
        catch (error) {
            throw error;
        }
    }
    static async checkTokenExpiryHelper(token) {
        try {
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const user = await authDBModels.User.findOne({
                resetPasswordToken: token,
            }).lean();
            if (!user) {
                throw new customError_1.CustomError("User does not exist", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            if (user.resetPasswordExpires &&
                new Date(user.resetPasswordExpires).toISOString() <
                    new Date().toISOString()) {
                throw new customError_1.CustomError("Token expired", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    static async resetPasswordHelper({ token, password }) {
        try {
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const user = await authDBModels.User.findOne({
                resetPasswordToken: token,
            }).lean();
            if (!user) {
                throw new customError_1.CustomError("Authentication failed", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            await authDBModels.User.updateOne({ _id: user._id }, {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.LoginRegisterHelper = LoginRegisterHelper;
