"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate32BitToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Generate a random 256-bit (6-byte) secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('JWT Secret Key:', secretKey);
function generate32BitToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
exports.generate32BitToken = generate32BitToken;
