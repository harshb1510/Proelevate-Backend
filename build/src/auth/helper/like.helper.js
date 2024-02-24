"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeHelper = void 0;
const authConnection_1 = require("../../DB/authConnection");
async function LikeHelper(userId, likedUserId) {
    try {
        const { success, authDBModels } = (0, authConnection_1.createAuthDbConnection)();
        if (!success) {
            throw new Error("Unable to connect to Auth db");
        }
        const likedUser = await authDBModels.User.findById(likedUserId);
        if (!likedUser) {
            throw new Error("Liked user not found");
        }
        // Increase points
        likedUser.points += 1;
        await likedUser.save();
    }
    catch (error) {
        throw error;
    }
}
exports.LikeHelper = LikeHelper;
