import { Router } from "express";
import { agentController } from "../controllers/agent.controller";
import { authenticate, validate } from "../middleware/auth";
import { createAgentSchema, updateAgentSchema } from "../utils/validation";

const router = Router();

router.use(authenticate);

router.get("/", agentController.getAll);
router.get("/:id", agentController.getById);
router.post("/", validate(createAgentSchema), agentController.create);
router.patch("/:id", validate(updateAgentSchema), agentController.update);
router.delete("/:id", agentController.delete);

export const agentRoutes = router;
export default router;
