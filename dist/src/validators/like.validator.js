"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeValidatorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.likeValidatorSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    likedUserId: joi_1.default.string().required()
});
