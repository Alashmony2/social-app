import { Router } from "express";
import authService from "./auth.service";
const router = Router();
router.post("/register", authService.register);
router.post("/login", authService.login);
export default router;
