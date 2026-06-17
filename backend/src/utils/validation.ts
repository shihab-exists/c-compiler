import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const compileSchema = z.object({
  code: z.string().max(1024 * 1024), // 1MB
  input: z.string().optional(),
  projectId: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  sourceCode: z.string().optional(),
  language: z.string().default("c"),
});
