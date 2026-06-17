import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const [totalRuns, totalProjects, successRuns, snippets] = await Promise.all([
      prisma.run.count({ where: { userId: req.user!.id } }),
      prisma.project.count({ where: { userId: req.user!.id } }),
      prisma.run.count({ where: { userId: req.user!.id, status: { in: ["success", "warning"] } } }),
      prisma.snippet.findMany({
        where: { userId: req.user!.id },
        orderBy: { usageCount: "desc" },
        take: 5,
      }),
    ]);

    const successRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 0;

    res.json({
      totalRuns,
      totalProjects,
      compileSuccessRate: successRate,
      mostUsedSnippets: snippets,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
