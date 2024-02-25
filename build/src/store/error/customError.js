"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const responseCode_enum_1 = require("../enums/HTTP_Response_Code/responseCode.enum");
class CustomError extends Error {
    constructor(message, statusCode = responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
