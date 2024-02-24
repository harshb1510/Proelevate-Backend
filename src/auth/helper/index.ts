import { createAuthDbConnection } from "../../DB/authConnection";
import { IAuthUser, IUser } from "../../store/interfaces/auth/user.interface";
import bcrypt from "bcrypt";
import { generate32BitToken } from "../logics/jwtSecretKey.logic";
import { CustomError } from "../../store/error/customError";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { replaceTemplate, sendEmail } from "../../store/notification/sendMail";


export class LoginRegisterHelper {
    static async RegisterHelper(data: IUser): Promise<IUser> {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const { success, authDBModels } = createAuthDbConnection();

            if (success) {
                const firebaseKey = generate32BitToken();

                const userInfo: IUser = {
                    Name: data.Name,
                    emailId: data.emailId,
                    password: hashedPassword,
                    firebaseToken: firebaseKey,
                    github: data.github,
                };
                const user = new authDBModels.User(userInfo);

                await user.save();
                return userInfo;
            } else {
                throw new Error("Unable to connect to Auth db");
            }
        } catch (error) {
            throw error;
        }
    }

    static async LoginHelper({ emailId, password }) {
        try {
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const searchFilter = emailId
                ? { emailId }
                : null;

            const user: IUser = await authDBModels.User.findOne(
                searchFilter
            ).lean();

            if (!user) {
                throw new CustomError(
                    "User Not found",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }
            const access = await authDBModels.Access.findOne({
                _id: user.roleToken,
            }).lean();

            const passwordMatch = await bcrypt.compare(
                password,
                user.password as string
            );

            if (!passwordMatch) {
                throw new CustomError(
                    "Authentication failed",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }

            const userInfo: IAuthUser = {
                _id: user._id ? user._id.toString() : "",
                Name: user.Name,
                emailId: user.emailId,
            };

            const bearerToken = jwt.sign(userInfo, user.firebaseToken, {
                expiresIn: "10d", // Token expires in 10 days, adjust as needed
            });

            return {
                user,
                bearerToken,
                access,
            };
        } catch (error) {
            throw error;
        }
    }

    static async createResetUrlHelper({ emailId}) {
        try {
            const TOKEN_EXPIRY_TIME = 15; // 15 minutes
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const searchFilter = emailId
                ? { emailId }
                : null;

            if (!searchFilter) {
                throw new CustomError(
                    "Please provide emailId or phoneNumber",
                    EHTTPS_RESPONSE_CODE.BAD_REQUEST
                );
            }

            const user: IUser = await authDBModels.User.findOne(
                searchFilter
            ).lean();

            if (!user) {
                throw new CustomError(
                    "No user found",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }

            const resetPasswordToken = generate32BitToken();

            await authDBModels.User.updateOne(
                { _id: user._id },
                {
                    resetPasswordToken,
                    resetPasswordExpires: new Date(
                        Date.now() + TOKEN_EXPIRY_TIME * 60 * 1000
                    ).toISOString(),
                }
            );

            const resetUrl = `${process.env.RESET_PASSWORD_URL}/resetPassword?token=${resetPasswordToken}`;
            const body = `Click on the link to reset your password: <a href=${resetUrl}>Reset Password</a>`;
            const subject = "Reset Password";
            const htmlPath = path.join(
                __dirname,
                "../../store/templates/template.html"
            );
            const htmlTemplate = fs.readFileSync(htmlPath, "utf8");
            const emailContent = { subject, body };
            const htmlToSend = replaceTemplate(htmlTemplate, emailContent);
            sendEmail({
                body: htmlToSend,
                destination: [user.emailId],
                subject,
            });

            return "Reset url sent to your email";
        } catch (error) {
            throw error;
        }
    }

    static async checkTokenExpiryHelper(token) {
        try {
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const user: IUser = await authDBModels.User.findOne({
                resetPasswordToken: token,
            }).lean();

            if (!user) {
                throw new CustomError(
                    "User does not exist",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }

            if (
                user.resetPasswordExpires &&
                new Date(user.resetPasswordExpires).toISOString() <
                new Date().toISOString()
            ) {
                throw new CustomError(
                    "Token expired",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async resetPasswordHelper({ token, password }) {
        try {
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const user: IUser = await authDBModels.User.findOne({
                resetPasswordToken: token,
            }).lean();

            if (!user) {
                throw new CustomError(
                    "Authentication failed",
                    EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await authDBModels.User.updateOne(
                { _id: user._id },
                {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                }
            );

            return true;
        } catch (error) {
            throw error;
        }
    }
}
