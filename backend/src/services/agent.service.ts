import { DEFAULT_AGENT_MODEL } from "../config/models";
import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CreateAgentInput, UpdateAgentInput } from "../utils/validation";

export const agentService = {
  async getAll(userId: string) {
    return prisma.agent.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { chats: true, files: true } },
      },
    });
  },

  async getById(userId: string, agentId: string) {
    const agent = await prisma.agent.findFirst({
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
      throw new AppError(404, "Agent not found");
    }

    return agent;
  },

  async create(userId: string, input: CreateAgentInput) {
    return prisma.agent.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        avatar: input.avatar || "🤖",
        systemPrompt: input.systemPrompt,
        model: input.model || DEFAULT_AGENT_MODEL,
        temperature: input.temperature ?? 0.7,
      },
    });
  },

  async update(userId: string, agentId: string, input: UpdateAgentInput) {
    await agentService.verifyOwnership(userId, agentId);

    return prisma.agent.update({
      where: { id: agentId },
      data: input,
    });
  },

  async delete(userId: string, agentId: string) {
    await agentService.verifyOwnership(userId, agentId);

    await prisma.agent.delete({ where: { id: agentId } });
  },

  async verifyOwnership(userId: string, agentId: string) {
    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId },
    });

    if (!agent) {
      throw new AppError(404, "Agent not found");
    }

    return agent;
  },
};
