import { CreateAgentInput, UpdateAgentInput } from "../utils/validation";
export declare const agentService: {
    getAll(userId: string): Promise<({
        _count: {
            chats: number;
            files: number;
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
    })[]>;
    getById(userId: string, agentId: string): Promise<{
        chats: ({
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
        files: {
            path: string;
            id: string;
            createdAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            extractedText: string;
            agentId: string;
        }[];
        _count: {
            chats: number;
            files: number;
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
    }>;
    create(userId: string, input: CreateAgentInput): Promise<{
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
    }>;
    update(userId: string, agentId: string, input: UpdateAgentInput): Promise<{
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
    }>;
    delete(userId: string, agentId: string): Promise<void>;
    verifyOwnership(userId: string, agentId: string): Promise<{
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
    }>;
};
//# sourceMappingURL=agent.service.d.ts.map