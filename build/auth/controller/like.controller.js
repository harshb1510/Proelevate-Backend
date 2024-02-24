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
exports.LikeController = void 0;
const like_validator_1 = require("../../validators/like.validator");
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const like_helper_1 = require("../helper/like.helper");
const pino_1 = require("../../store/logger/pino");
class LikeController {
    static likeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, likedUserId } = yield like_validator_1.likeValidatorSchema.validateAsync(req.body);
                yield (0, like_helper_1.LikeHelper)(userId, likedUserId);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json({ message: "User liked successfully" });
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
}
__decorate([
    (0, pino_1.LogRequestResponse)()
], LikeController, "likeUser", null);
exports.LikeController = LikeController;
