"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/register", (0, auth_1.validate)(validation_1.registerSchema), auth_controller_1.authController.register);
router.post("/login", (0, auth_1.validate)(validation_1.loginSchema), auth_controller_1.authController.login);
router.get("/me", auth_1.authenticate, auth_controller_1.authController.getProfile);
router.patch("/me", auth_1.authenticate, (0, auth_1.validate)(validation_1.updateProfileSchema), auth_controller_1.authController.updateProfile);
exports.authRoutes = router;
//# sourceMappingURL=auth.routes.js.map