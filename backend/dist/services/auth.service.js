"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const SALT_ROUNDS = 12;
const tokenOptions = {
    expiresIn: env_1.env.JWT_EXPIRES_IN,
};
exports.authService = {
    async register(input) {
        const existing = await database_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (existing) {
            throw new response_1.AppError(409, "Email already registered");
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = await database_1.prisma.user.create({
            data: {
                name: input.name,
                email: input.email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, tokenOptions);
        return { user, token };
    },
    async login(input) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!user) {
            throw new response_1.AppError(401, "Invalid email or password");
        }
        const valid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!valid) {
            throw new response_1.AppError(401, "Invalid email or password");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, tokenOptions);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            token,
        };
    },
    async getProfile(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                _count: { select: { agents: true } },
            },
        });
        if (!user) {
            throw new response_1.AppError(404, "User not found");
        }
        return user;
    },
    async updateProfile(userId, input) {
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data: input,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
        });
        return user;
    },
};
//# sourceMappingURL=auth.service.js.map