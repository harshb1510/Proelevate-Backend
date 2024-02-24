"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoFetchBuilder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class UserInfoFetchBuilder {
    constructor() {
        this.query = {};
    }
    addEmail(emailId) {
        if (emailId) {
            this.query['emailId'] = emailId;
        }
        return this;
    }
    addId(_id) {
        if (_id) {
            this.query['_id'] = new mongoose_1.default.Types.ObjectId(_id.toString());
        }
        return this;
    }
    buildQuery() {
        return this.query;
    }
}
exports.UserInfoFetchBuilder = UserInfoFetchBuilder;
