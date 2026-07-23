import { prisma } from "../config/database";

export const dashboardService = {
  async getStats(userId: string) {
    const [agentCount, chatCount, messageCount, recentAgents, recentChats] =
      await Promise.all([
        prisma.agent.count({ where: { userId } }),
        prisma.chat.count({
          where: { agent: { userId } },
        }),
        prisma.message.count({
          where: { chat: { agent: { userId } } },
        }),
        prisma.agent.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 5,
          include: {
            _count: { select: { chats: true } },
          },
        }),
        prisma.chat.findMany({
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
