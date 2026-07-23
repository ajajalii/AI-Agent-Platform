"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chat_service_1 = require("../services/chat.service");
const response_1 = require("../utils/response");
const params_1 = require("../utils/params");
exports.chatController = {
    getChats: async (req, res, next) => {
        try {
            const chats = await chat_service_1.chatService.getChats(req.userId, (0, params_1.requiredParam)(req, "agentId"));
            (0, response_1.sendSuccess)(res, chats);
        }
        catch (error) {
            next(error);
        }
    },
    getChat: async (req, res, next) => {
        try {
            const chat = await chat_service_1.chatService.getChat(req.userId, (0, params_1.requiredParam)(req, "agentId"), (0, params_1.requiredParam)(req, "chatId"));
            (0, response_1.sendSuccess)(res, chat);
        }
        catch (error) {
            next(error);
        }
    },
    createChat: async (req, res, next) => {
        try {
            const chat = await chat_service_1.chatService.createChat(req.userId, (0, params_1.requiredParam)(req, "agentId"), req.body.title);
            (0, response_1.sendSuccess)(res, chat, 201);
        }
        catch (error) {
            next(error);
        }
    },
    deleteChat: async (req, res, next) => {
        try {
            await chat_service_1.chatService.deleteChat(req.userId, (0, params_1.requiredParam)(req, "agentId"), (0, params_1.requiredParam)(req, "chatId"));
            (0, response_1.sendSuccess)(res, { message: "Conversation deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    sendMessage: async (req, res, next) => {
        try {
            const result = await chat_service_1.chatService.sendMessage(req.userId, (0, params_1.requiredParam)(req, "agentId"), (0, params_1.requiredParam)(req, "chatId"), req.body.content);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=chat.controller.js.map