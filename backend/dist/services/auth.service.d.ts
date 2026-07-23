import { RegisterInput, LoginInput, UpdateProfileInput } from "../utils/validation";
export declare const authService: {
    register(input: RegisterInput): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            avatar: string | null;
            createdAt: Date;
        };
        token: string;
    }>;
    login(input: LoginInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
            createdAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        avatar: string | null;
        createdAt: Date;
        _count: {
            agents: number;
        };
    }>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<{
        name: string;
        id: string;
        email: string;
        avatar: string | null;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map