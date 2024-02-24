import { Request, Response } from "express";
import { ILikeRequest } from "../../store/interfaces/auth/user.interface";
import { likeValidatorSchema } from "../../validators/like.validator";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { LikeHelper } from "../helper/like.helper";

export class LikeController {
    static async likeUser(req: Request, res: Response) {
        try {
            const { userId, likedUserId }: ILikeRequest = await likeValidatorSchema.validateAsync(req.body);
            
            await LikeHelper(userId, likedUserId);

            return res.status(EHTTPS_RESPONSE_CODE.OK).json({ message: "User liked successfully" });
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }
}
