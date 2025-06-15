export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  },
  app: {
    name: "Bank Verification Platform",
    version: "1.0.0",
  },
  features: {
    enableReminders: true,
    maxExpirationDays: 30,
    defaultExpirationDays: 7,
  },
}
