export const env = {
  get ANTHROPIC_API_KEY() {
    return process.env.ANTHROPIC_API_KEY;
  },
  get DEFAULT_MODEL() {
    return process.env.DEFAULT_MODEL ?? 'claude-sonnet-4-20250514';
  },
} as const;

export function validateEnv() {
  const requiredVars = ['ANTHROPIC_API_KEY'] as const;

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
