import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate, validate } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../utils/validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), authController.updateProfile);

export default router;
