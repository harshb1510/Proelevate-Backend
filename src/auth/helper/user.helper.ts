import bcrypt from "bcrypt";
import { createAuthDbConnection } from "../../DB/authConnection";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { CustomError } from "../../store/error/customError";
import { IAuthUser } from "../../store/interfaces/auth/user.interface";
import { UpdateUserQueryBuilder } from "../logics/updateUser.builder";
import { UserInfoFetchBuilder } from "../logics/userInfo.builder";
import { IUser } from "../../store/interfaces/auth/user.interface";

export class UserInfoHelper {
    static async getUserInfo(data) {
        try {
            const userInfoQuery = new UserInfoFetchBuilder()
                .addEmail(data.emailId)
                .addId(data._id)
                .buildQuery();

            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }

            let userDetails: IAuthUser = await authDBModels.User.findOne(
                userInfoQuery
            )
                .populate("roleToken")
                .lean()
                .select(["-password", "-firebaseToken", "-updatedAt", "-__v"]);

            if (!userDetails) {
                throw new CustomError(
                    "No user found with the given user info",
                    EHTTPS_RESPONSE_CODE.NOT_FOUND
                );
            }

            return {
                ...userDetails,
                roleToken: undefined,
            };
        } catch (error) {
            throw error;
        }
    }

    static async amendUserInfo(data) {
        try {
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }

            let user = await authDBModels.User.findOne({ _id: data._id });

            if (!user) {
                throw new CustomError(
                    "Unable to find user",
                    EHTTPS_RESPONSE_CODE.NOT_FOUND
                );
            }

            if (data.password) {
                if (!await bcrypt.compare(
                    data.previousPassword as string,
                    user.password as string,
                )) {
                    throw new CustomError(
                        "Incorrect previous password",
                        EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS
                    );
                }
            }

            user = new UpdateUserQueryBuilder(data, user)
                .setPassword()
                .getQuery();

            const updatedUser = await user
                .updateOne(user, { new: true, upsert: true, timestamps: false })
                .lean();

            if (updatedUser.matchedCount < 1) {
                throw new Error("Failed to update");
            }

            return { count: updatedUser.matchedCount };
        } catch (error) {
            throw error;
        }
    }

    static async getUsersByPointsAscending() {
        try {
            const { success, authDBModels } = createAuthDbConnection();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }

            const users: IUser[] = await authDBModels.User.find()
                .sort({ points: 1 })
                .lean()
                .select(["-password", "-firebaseToken", "-updatedAt", "-__v"]);

            if (!users) {
                throw new CustomError(
                    "No users found",
                    EHTTPS_RESPONSE_CODE.NOT_FOUND
                );
            }

            return users;
        } catch (error) {
            throw error;
        }
    }
}
