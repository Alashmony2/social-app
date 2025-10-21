import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";
import { commentRouter } from "..";

const router = Router();
router.use("/:postId/comment", commentRouter);
router.post("/", isAuthenticated(), postService.create);
router.patch("/:id", isAuthenticated(), postService.addReaction);
router.get("/:id", postService.getSpecific);
router.delete("/:id", isAuthenticated(), postService.deletePost);
router.patch("/freeze/:id", isAuthenticated(), postService.freezePost);
router.patch("/unfreeze/:id", isAuthenticated(), postService.unfreezePost);
router.patch("/update/:id", isAuthenticated(), postService.update);
export default router;
