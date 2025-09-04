import { Router } from "express";
import authService from "./auth.service";
const router = Router();
router.post("/register", authService.register);
export default router;
