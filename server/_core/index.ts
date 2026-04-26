import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";

// Multi-path dotenv strategy — tries every plausible location so .env is
// always loaded regardless of where PM2 or the shell launches from.
const __dir = dirname(fileURLToPath(import.meta.url));
const envCandidates = [
  // production: script is dist/index.js, .env is one level up at project root
  resolve(__dir, "../.env"),
  // development: script is server/_core/index.ts, .env is two levels up
  resolve(__dir, "../../.env"),
  // fallback: wherever Node's current working directory is (covers PM2 cwd scenarios)
  resolve(process.cwd(), ".env"),
];

let envLoaded = false;
for (const p of envCandidates) {
  if (existsSync(p)) {
    const result = loadEnv({ path: p, override: false });
    if (!result.error) {
      console.log(`[env] Loaded .env from: ${p}`);
      envLoaded = true;
      break;
    }
  }
}
if (!envLoaded) {
  console.warn("[env] WARNING: No .env file found in any candidate path — relying on shell environment variables only.");
}

// Stripe key check — early warning so the log shows the problem immediately on boot
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[Stripe] WARNING: STRIPE_SECRET_KEY is not set. Check your .env file or PM2 env config.");
  console.warn("[Stripe] Searched paths:", envCandidates.join(", "));
} else {
  console.log("[Stripe] STRIPE_SECRET_KEY detected — Stripe will initialize on first use.");
}

import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { registerStripeWebhook } from "../stripe";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./static";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Register Stripe webhook BEFORE express.json() so raw body is preserved for signature verification
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite dev server; production mode serves pre-built static files.
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
