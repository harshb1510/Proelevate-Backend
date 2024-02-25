import { createAuthDbConnection } from "../../DB/authConnection";
import { IUser } from "../../store/interfaces/auth/user.interface";

export async function LikeHelper(userId: string, likedUserId: string): Promise<string> {
    try {
        const { success, authDBModels } = createAuthDbConnection();
        if (!success) {
            throw new Error("Unable to connect to Auth db");
        }

        const user = await authDBModels.User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const likedUser = await authDBModels.User.findById(likedUserId);
        if (!likedUser) {
            throw new Error("Liked user not found");
        }


        const alreadyLiked = user.likedUsers.includes(likedUserId);

        if (alreadyLiked) {

            const index = user.likedUsers.indexOf(likedUserId);
            user.likedUsers.splice(index, 1);


            likedUser.points -= 1;


            if (likedUser.points < 0) {
                likedUser.points = 0;
            }


            await likedUser.save();


            await user.save();


            return "User disliked successfully";
        } else {

            user.likedUsers.push(likedUserId);


            likedUser.points += 1;


            await likedUser.save();


            await user.save();

            return "User liked successfully";
        }
    } catch (error) {
        throw error;
    }
}
