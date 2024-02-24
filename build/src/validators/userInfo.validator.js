"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdationValidationSchema = exports.userIdentificationValidatorSchema = exports.userValidatorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userValidatorSchema = joi_1.default.object({
    Name: joi_1.default.string().required(),
    emailId: joi_1.default.string().email().required().lowercase(),
    password: joi_1.default.string().required(),
    github: joi_1.default.string().optional(),
});
exports.userIdentificationValidatorSchema = joi_1.default.object({
    emailId: joi_1.default.string().email().optional().lowercase(),
    _id: joi_1.default.string().hex().length(24).optional(),
});
exports.userUpdationValidationSchema = joi_1.default.object({
    password: joi_1.default.string().optional().allow("", null),
    _id: joi_1.default.string().hex().length(24).required(),
    previousPassword: joi_1.default.string().optional().allow("", null),
})
    .with("password", "previousPassword");
