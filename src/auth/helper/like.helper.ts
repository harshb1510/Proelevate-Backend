import { createAuthDbConnection } from "../../DB/authConnection";

export async function LikeHelper(userId: string, likedUserId: string): Promise<void> {
    try {
        const { success, authDBModels } = createAuthDbConnection();
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
    } catch (error) {
        throw error;
    }
}
