import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import commentService from "./comment.service";

const router = Router({mergeParams:true});
router.post("{/:id}",isAuthenticated(),commentService.create)
export default router;
