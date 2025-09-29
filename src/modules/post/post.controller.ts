import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";

const router = Router();
router.post("/", isAuthenticated(), postService.create);
router.patch("/:id", isAuthenticated(), postService.addReaction);
export default router;
