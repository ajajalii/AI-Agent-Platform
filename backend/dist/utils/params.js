"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredParam = void 0;
const response_1 = require("./response");
const requiredParam = (req, name) => {
    const value = req.params[name];
    if (typeof value !== "string" || value.length === 0) {
        throw new response_1.AppError(400, `Missing route parameter: ${name}`);
    }
    return value;
};
exports.requiredParam = requiredParam;
//# sourceMappingURL=params.js.map