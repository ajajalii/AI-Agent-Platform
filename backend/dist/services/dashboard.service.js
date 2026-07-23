"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const database_1 = require("../config/database");
exports.dashboardService = {
    async getStats(userId) {
        const [agentCount, chatCount, messageCount, recentAgents, recentChats] = await Promise.all([
            database_1.prisma.agent.count({ where: { userId } }),
            database_1.prisma.chat.count({
                where: { agent: { userId } },
            }),
            database_1.prisma.message.count({
                where: { chat: { agent: { userId } } },
            }),
            database_1.prisma.agent.findMany({
                where: { userId },
                orderBy: { updatedAt: "desc" },
                take: 5,
                include: {
                    _count: { select: { chats: true } },
                },
            }),
            database_1.prisma.chat.findMany({
                where: { agent: { userId } },
                orderBy: { updatedAt: "desc" },
                take: 5,
                include: {
                    agent: { select: { id: true, name: true, avatar: true } },
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            }),
        ]);
        return {
            stats: {
                agents: agentCount,
                conversations: chatCount,
                messages: messageCount,
            },
            recentAgents,
            recentChats,
        };
    },
};
//# sourceMappingURL=dashboard.service.js.map