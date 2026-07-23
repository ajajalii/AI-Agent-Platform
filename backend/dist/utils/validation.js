"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.createChatSchema = exports.updateAgentSchema = exports.createAgentSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    avatar: zod_1.z.string().max(500).optional(),
});
exports.createAgentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100),
    description: zod_1.z.string().max(500).optional(),
    avatar: zod_1.z.string().max(10).optional(),
    systemPrompt: zod_1.z.string().min(1, "System prompt is required").max(10000),
    model: zod_1.z.string().max(100).optional(),
    temperature: zod_1.z.number().min(0).max(2).optional(),
});
exports.updateAgentSchema = exports.createAgentSchema.partial();
exports.createChatSchema = zod_1.z.object({
    title: zod_1.z.string().max(200).optional(),
});
exports.sendMessageSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Message cannot be empty").max(32000),
});
//# sourceMappingURL=validation.js.map