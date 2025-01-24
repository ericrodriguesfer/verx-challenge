import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = z.enum(['development', 'production']);

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),
  NODE_ENV: nodeEnv.default('development').optional(),
});

export const Env = envSchema.parse(process.env);
