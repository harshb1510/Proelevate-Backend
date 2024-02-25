import { Request, Response } from "express";
import { ILikeRequest } from "../../store/interfaces/auth/user.interface";
import { likeValidatorSchema } from "../../validators/like.validator";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { LikeHelper } from "../helper/like.helper";
import { LogRequestResponse } from "../../store/logger/pino";

export class LikeController {
    @LogRequestResponse()
    static async likeUser(req: Request, res: Response) {
        try {
            const { userId, likedUserId }: ILikeRequest = await likeValidatorSchema.validateAsync(req.body);
            
            const message = await LikeHelper(userId, likedUserId);

            return res.status(EHTTPS_RESPONSE_CODE.OK).json({ message });
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }
}
