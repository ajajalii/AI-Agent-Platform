"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = void 0;
const openrouter_service_1 = require("./openrouter.service");
const provider = openrouter_service_1.openRouterService;
exports.llmService = {
    complete(options) {
        return provider.complete(options);
    },
};
//# sourceMappingURL=llm.service.js.map