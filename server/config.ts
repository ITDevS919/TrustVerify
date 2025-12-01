import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("Invalid database URL"),
  SESSION_SECRET: z.string().min(32, "Session secret must be at least 32 characters"),
  SENDGRID_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  VITE_STRIPE_PUBLIC_KEY: z.string().optional(),
  PORT: z.string().transform(Number).default("5000"),
});

export type Config = z.infer<typeof configSchema>;

function validateConfig(): Config {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Configuration validation failed:");
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const config = validateConfig();