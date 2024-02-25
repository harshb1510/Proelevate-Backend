"use strict";
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
exports.LikeHelper = void 0;
const authConnection_1 = require("../../DB/authConnection");
function LikeHelper(userId, likedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
            if (!success) {
                throw new Error("Unable to connect to Auth db");
            }
            const likedUser = yield authDBModels.User.findById(likedUserId);
            if (!likedUser) {
                throw new Error("Liked user not found");
            }
            // Increase points
            likedUser.points += 1;
            yield likedUser.save();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.LikeHelper = LikeHelper;
