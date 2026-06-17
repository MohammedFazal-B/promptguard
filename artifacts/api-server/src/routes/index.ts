import { Router, type IRouter } from "express";
import healthRouter from "./health";
import promptguardRouter from "./promptguard";
import anthropicRouter from "./anthropic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(promptguardRouter);
router.use(anthropicRouter);

export default router;
