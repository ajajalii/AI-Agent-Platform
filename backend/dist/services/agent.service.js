"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = void 0;
const models_1 = require("../config/models");
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
exports.agentService = {
    async getAll(userId) {
        return database_1.prisma.agent.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                _count: { select: { chats: true, files: true } },
            },
        });
    },
    async getById(userId, agentId) {
        const agent = await database_1.prisma.agent.findFirst({
            where: { id: agentId, userId },
            include: {
                _count: { select: { chats: true, files: true } },
                chats: {
                    orderBy: { updatedAt: "desc" },
                    take: 5,
                    include: {
                        messages: {
                            orderBy: { createdAt: "desc" },
                            take: 1,
                        },
                    },
                },
                files: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!agent) {
            throw new response_1.AppError(404, "Agent not found");
        }
        return agent;
    },
    async create(userId, input) {
        return database_1.prisma.agent.create({
            data: {
                userId,
                name: input.name,
                description: input.description,
                avatar: input.avatar || "🤖",
                systemPrompt: input.systemPrompt,
                model: input.model || models_1.DEFAULT_AGENT_MODEL,
                temperature: input.temperature ?? 0.7,
            },
        });
    },
    async update(userId, agentId, input) {
        await exports.agentService.verifyOwnership(userId, agentId);
        return database_1.prisma.agent.update({
            where: { id: agentId },
            data: input,
        });
    },
    async delete(userId, agentId) {
        await exports.agentService.verifyOwnership(userId, agentId);
        await database_1.prisma.agent.delete({ where: { id: agentId } });
    },
    async verifyOwnership(userId, agentId) {
        const agent = await database_1.prisma.agent.findFirst({
            where: { id: agentId, userId },
        });
        if (!agent) {
            throw new response_1.AppError(404, "Agent not found");
        }
        return agent;
    },
};
//# sourceMappingURL=agent.service.js.map