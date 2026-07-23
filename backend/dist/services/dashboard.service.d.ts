export declare const dashboardService: {
    getStats(userId: string): Promise<{
        stats: {
            agents: number;
            conversations: number;
            messages: number;
        };
        recentAgents: ({
            _count: {
                chats: number;
            };
        } & {
            model: string;
            name: string;
            id: string;
            avatar: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            systemPrompt: string;
            temperature: number;
            userId: string;
        })[];
        recentChats: ({
            agent: {
                name: string;
                id: string;
                avatar: string;
            };
            messages: {
                id: string;
                createdAt: Date;
                content: string;
                role: import(".prisma/client").$Enums.MessageRole;
                chatId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            agentId: string;
        })[];
    }>;
};
//# sourceMappingURL=dashboard.service.d.ts.map