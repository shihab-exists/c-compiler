import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/explain", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  res.json({
    explanation: `AI explanation placeholder for:\n\n${code}\n\nIn production, connect to OpenAI/Claude API to explain functions, loops, arrays, pointers, and structures.`,
  });
});

router.post("/error-analysis", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { error } = req.body;
  res.json({
    analysis: `AI error analysis placeholder for:\n\n${error}\n\nIn production, connect to OpenAI/Claude API to classify syntax, runtime, and logical errors and suggest fixes.`,
  });
});

router.post("/complexity", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  res.json({
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    note: "AI complexity analysis placeholder. In production, use OpenAI/Claude or static analysis.",
  });
});

export default router;
