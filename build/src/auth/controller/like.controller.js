"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const like_validator_1 = require("../../validators/like.validator");
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const like_helper_1 = require("../helper/like.helper");
const pino_1 = require("../../store/logger/pino");
class LikeController {
    static async likeUser(req, res) {
        try {
            const { userId, likedUserId } = await like_validator_1.likeValidatorSchema.validateAsync(req.body);
            await (0, like_helper_1.LikeHelper)(userId, likedUserId);
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json({ message: "User liked successfully" });
        }
        catch (error) {
            return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }
}
__decorate([
    (0, pino_1.LogRequestResponse)()
], LikeController, "likeUser", null);
exports.LikeController = LikeController;
