export declare const fileService: {
    getFiles(userId: string, agentId: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        extractedText: string;
        agentId: string;
    }[]>;
    uploadFile(userId: string, agentId: string, file: Express.Multer.File): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        extractedText: string;
        agentId: string;
    }>;
    deleteFile(userId: string, agentId: string, fileId: string): Promise<void>;
};
//# sourceMappingURL=file.service.d.ts.map