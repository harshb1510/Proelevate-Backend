"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.accessSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    }
}, {
    timestamps: true
});
