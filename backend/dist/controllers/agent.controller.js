"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentController = void 0;
const agent_service_1 = require("../services/agent.service");
const response_1 = require("../utils/response");
const params_1 = require("../utils/params");
exports.agentController = {
    getAll: async (req, res, next) => {
        try {
            const agents = await agent_service_1.agentService.getAll(req.userId);
            (0, response_1.sendSuccess)(res, agents);
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const agent = await agent_service_1.agentService.getById(req.userId, (0, params_1.requiredParam)(req, "id"));
            (0, response_1.sendSuccess)(res, agent);
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const agent = await agent_service_1.agentService.create(req.userId, req.body);
            (0, response_1.sendSuccess)(res, agent, 201);
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const agent = await agent_service_1.agentService.update(req.userId, (0, params_1.requiredParam)(req, "id"), req.body);
            (0, response_1.sendSuccess)(res, agent);
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await agent_service_1.agentService.delete(req.userId, (0, params_1.requiredParam)(req, "id"));
            (0, response_1.sendSuccess)(res, { message: "Agent deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=agent.controller.js.map