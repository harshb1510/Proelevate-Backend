"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const dotenv = __importStar(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const authConnection_1 = require("../DB/authConnection");
const responseCode_enum_1 = require("../store/enums/HTTP_Response_Code/responseCode.enum");
const customError_1 = require("../store/error/customError");
const accessToken_enum_1 = require("../store/enums/auth/accessToken.enum");
dotenv.config();
function authenticateToken(roles = [accessToken_enum_1.EAccess.USER]) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!roles.includes(accessToken_enum_1.EAccess.NOT_VALIDATED)) {
                let bearerToken = req.header("Authorization");
                const token = req.header("token");
                if (!bearerToken) {
                    throw new customError_1.CustomError("Authorization Missing", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
                }
                bearerToken = bearerToken.replace("Bearer ", "");
                if (!token) {
                    throw new customError_1.CustomError("Token Missing", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
                }
                const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
                if (!success) {
                    throw new customError_1.CustomError("🔴 DB Connection Failed!");
                }
                let user = yield authDBModels.User.findOne({
                    _id: new mongoose_1.default.Types.ObjectId(token),
                });
                if (!user) {
                    throw new customError_1.CustomError("User not found", responseCode_enum_1.EHTTPS_RESPONSE_CODE.NOT_FOUND);
                }
                const access = yield authDBModels.Access.findOne({ _id: user.roleToken }).lean();
                jsonwebtoken_1.default.verify(bearerToken, user.firebaseToken, (err, user) => {
                    const accessValue = access.access;
                    if (!roles.includes(accessValue)) {
                        throw new customError_1.CustomError("Access Denied", responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS);
                    }
                });
            }
            else {
                next();
            }
        }
        catch (err) {
            return res.status(err.statusCode ? err.statusCode : responseCode_enum_1.EHTTPS_RESPONSE_CODE.UNAUTHORIZED_ACCESS).json({
                error: {
                    message: "Error from auth: " + err.message
                }
            });
        }
    });
}
exports.authenticateToken = authenticateToken;
