import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();
router.get("/profile",isAuthenticated(),userService.getProfile)
router.post("/sendFriendRequest/:id",isAuthenticated(),userService.sendFriendRequest)
export default router;
