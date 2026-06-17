import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const snippets = await prisma.snippet.findMany({
      where: { OR: [{ isBuiltin: true }, { userId: req.user!.id }] },
      orderBy: [{ isBuiltin: "desc" }, { usageCount: "desc" }],
    });
    res.json(snippets);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const { title, category, description, code } = req.body;
    const snippet = await prisma.snippet.create({
      data: { userId: req.user!.id, title, category, description, code },
    });
    res.status(201).json(snippet);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/use", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    await prisma.snippet.update({
      where: { id: req.params.id },
      data: { usageCount: { increment: 1 } },
    });
    res.json({ message: "Usage incremented" });
  } catch (err) {
    next(err);
  }
});

export default router;
