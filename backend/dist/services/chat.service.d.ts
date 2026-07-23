export declare const chatService: {
    getChats(userId: string, agentId: string): Promise<({
        _count: {
            messages: number;
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
    })[]>;
    getChat(userId: string, agentId: string, chatId: string): Promise<{
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
    }>;
    createChat(userId: string, agentId: string, title?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        agentId: string;
    }>;
    deleteChat(userId: string, agentId: string, chatId: string): Promise<void>;
    sendMessage(userId: string, agentId: string, chatId: string, content: string): Promise<{
        userMessage: {
            id: string;
            createdAt: Date;
            content: string;
            role: import(".prisma/client").$Enums.MessageRole;
            chatId: string;
        };
        assistantMessage: {
            id: string;
            createdAt: Date;
            content: string;
            role: import(".prisma/client").$Enums.MessageRole;
            chatId: string;
        };
    }>;
};
//# sourceMappingURL=chat.service.d.ts.map