import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();
router.get("/profile", isAuthenticated(), userService.getProfile);
router.post(
  "/sendFriendRequest/:id",
  isAuthenticated(),
  userService.sendFriendRequest
);
router.post(
  "/acceptFriendRequest/:id",
  isAuthenticated(),
  userService.acceptFriendRequest
);
router.post(
  "/deleteFriendRequest/:id",
  isAuthenticated(),
  userService.deleteFriendRequest
);
router.post(
  "/unfriend/:id",
  isAuthenticated(),
  userService.unfriend
);
router.post(
  "/block/:id",
  isAuthenticated(),
  userService.blockUser
);
export default router;
