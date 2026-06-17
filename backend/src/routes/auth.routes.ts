import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../utils/validation";

const router = Router();

function generateToken(userId: string, email: string) {
  const secret = process.env.JWT_SECRET || "default-secret-change-in-production";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId, email }, secret, { expiresIn });
}

// Register
router.post("/register", async (req: Request, res: Response, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        settings: { create: {} },
      },
    });

    const token = generateToken(user.id, user.email);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req: Request, res: Response, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const token = generateToken(user.id, user.email);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
});

// Google OAuth stub
router.post("/google", async (req: Request, res: Response, next) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleId, avatar, settings: { create: {} } },
      });
    }
    const token = generateToken(user.id, user.email);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (err) {
    next(err);
  }
});

// Forgot password (stub sends email in production)
router.post("/forgot-password", async (_req: Request, res: Response) => {
  res.json({ message: "Password reset instructions sent if email exists." });
});

// Profile
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { settings: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/me", authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, avatar },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
