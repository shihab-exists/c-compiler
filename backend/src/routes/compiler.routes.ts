import { Router, Response } from "express";
import { runCCode } from "../services/dockerRunner.service";
import { compileSchema } from "../utils/validation";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/run", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const { code, input, projectId } = compileSchema.parse(req.body);
    const result = await runCCode(code, input);

    await prisma.run.create({
      data: {
        userId: req.user?.id,
        projectId,
        status: result.status,
        output: result.output,
        errors: result.errors,
        warnings: result.warnings,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
      },
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/compile", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const { code, input, projectId } = compileSchema.parse(req.body);
    const result = await runCCode(code, input);

    await prisma.run.create({
      data: {
        userId: req.user?.id,
        projectId,
        status: result.status,
        output: result.output,
        errors: result.errors,
        warnings: result.warnings,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
      },
    });

    res.json({
      success: result.status === "success" || result.status === "warning",
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
