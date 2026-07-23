"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
exports.authController = {
    register: async (req, res, next) => {
        try {
            const result = await auth_service_1.authService.register(req.body);
            (0, response_1.sendSuccess)(res, result, 201);
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            const user = await auth_service_1.authService.getProfile(req.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            const user = await auth_service_1.authService.updateProfile(req.userId, req.body);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map