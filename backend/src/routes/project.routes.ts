import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { projectSchema } from "../utils/validation";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        ...data,
        userId: req.user!.id,
        files: { create: { name: "main.c", content: data.sourceCode || "", isMain: true } },
      },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { files: true, runs: { take: 20, orderBy: { createdAt: "desc" } } },
    });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, description, sourceCode, inputData } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id, userId: req.user!.id },
      data: { name, description, sourceCode, inputData, updatedAt: new Date() },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id, userId: req.user!.id } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/duplicate", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const original = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { files: true },
    });
    if (!original) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const copy = await prisma.project.create({
      data: {
        userId: req.user!.id,
        name: `${original.name} (Copy)`,
        description: original.description,
        sourceCode: original.sourceCode,
        inputData: original.inputData,
        language: original.language,
        files: {
          create: original.files.map((f) => ({
            name: f.name,
            content: f.content,
            isMain: f.isMain,
          })),
        },
      },
    });
    res.status(201).json(copy);
  } catch (err) {
    next(err);
  }
});

export default router;
