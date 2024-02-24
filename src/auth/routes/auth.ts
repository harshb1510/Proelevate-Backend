import express from "express";

import { LoginRegisterController } from "../controller/index";
import { UserInfoController } from "../controller/user.controller";
import { authenticateToken } from "../../middleware";
import { LikeController } from "../controller/like.controller";

export const auth_routes = express.Router();

auth_routes.post("/login", LoginRegisterController.Login);


auth_routes.get(
    "/user/info",
    authenticateToken(),
    UserInfoController.getUserInfo
);

auth_routes.put(
    "/user/update",
    authenticateToken(),
    UserInfoController.updateInfo
);

auth_routes.get(
    "/user/restUrl/authenticate/:token",
    LoginRegisterController.checkTokenExpiryController
);

auth_routes.post(
    "/user/resetPassword/:token",
    LoginRegisterController.resetPasswordController
);

auth_routes.post(
    "/user/forgotPassword",
    LoginRegisterController.createResetUrlController
);

auth_routes.get(
    '/getUsers',
    authenticateToken(),
    UserInfoController.getUsersByPointsAscending
)

auth_routes.post(
    '/likeUser',
    authenticateToken(),
    LikeController.likeUser
)