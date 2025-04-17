import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
})

export type EnvSchema = z.infer<typeof envSchema>
