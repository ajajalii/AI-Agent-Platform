"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_controller_1 = require("../controllers/agent.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/", agent_controller_1.agentController.getAll);
router.get("/:id", agent_controller_1.agentController.getById);
router.post("/", (0, auth_1.validate)(validation_1.createAgentSchema), agent_controller_1.agentController.create);
router.patch("/:id", (0, auth_1.validate)(validation_1.updateAgentSchema), agent_controller_1.agentController.update);
router.delete("/:id", agent_controller_1.agentController.delete);
exports.default = router;
//# sourceMappingURL=agent.routes.js.map