import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware";

import * as authValidation from "./auth.validation";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();
router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authService.register
);

router.post("/login", authService.login);
router.post("/confirm-email", authService.confirmEmail);
router.post("/update-password", isAuthenticated(), authService.updatePassword);
router.patch(
  "/update-basic-info",
  isAuthenticated(),
  isValid(authValidation.updateBasicInfoSchema),
  authService.updateBasicInfo
);
router.patch(
  "/update-email",
  isAuthenticated(),
  isValid(authValidation.updateEmailSchema),
  authService.updateEmail
);
export default router;
