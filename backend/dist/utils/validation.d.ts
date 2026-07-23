import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatar?: string | undefined;
}, {
    name?: string | undefined;
    avatar?: string | undefined;
}>;
export declare const createAgentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    systemPrompt: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    systemPrompt: string;
    model?: string | undefined;
    avatar?: string | undefined;
    description?: string | undefined;
    temperature?: number | undefined;
}, {
    name: string;
    systemPrompt: string;
    model?: string | undefined;
    avatar?: string | undefined;
    description?: string | undefined;
    temperature?: number | undefined;
}>;
export declare const updateAgentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    name?: string | undefined;
    avatar?: string | undefined;
    description?: string | undefined;
    systemPrompt?: string | undefined;
    temperature?: number | undefined;
}, {
    model?: string | undefined;
    name?: string | undefined;
    avatar?: string | undefined;
    description?: string | undefined;
    systemPrompt?: string | undefined;
    temperature?: number | undefined;
}>;
export declare const createChatSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
}, {
    title?: string | undefined;
}>;
export declare const sendMessageSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=validation.d.ts.map