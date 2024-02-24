"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserQueryBuilder = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UpdateUserQueryBuilder {
    constructor(data, user) {
        this.data = data;
        this.user = user;
    }
    setPassword() {
        if (this.data.password) {
            this.user.password = bcrypt_1.default.hashSync(this.data.password, 10);
        }
        return this;
    }
    getQuery() {
        return this.user;
    }
}
exports.UpdateUserQueryBuilder = UpdateUserQueryBuilder;
