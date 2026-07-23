"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_1 = require("../utils/response");
exports.dashboardController = {
    getStats: async (req, res, next) => {
        try {
            const data = await dashboard_service_1.dashboardService.getStats(req.userId);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map