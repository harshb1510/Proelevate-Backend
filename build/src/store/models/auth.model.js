"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthDBModels = void 0;
const user_schema_1 = require("../schema/auth/user.schema");
const access_schema_1 = require("../schema/auth/access.schema");
const createAuthDBModels = (authDBModel) => {
    let Access = authDBModel.model('AccessToken', access_schema_1.accessSchema);
    let User = authDBModel.model('User', user_schema_1.userSchema);
    return {
        User,
        Access
    };
};
exports.createAuthDBModels = createAuthDBModels;
