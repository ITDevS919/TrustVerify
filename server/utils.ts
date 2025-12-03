import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ESM
// In Jest/CommonJS, __dirname is already defined, so we use it or process.cwd()
// In ESM, we derive it from import.meta.url
function getBaseDir(): string {
  // Check if we're in a test environment (Jest sets NODE_ENV=test)
  if (process.env.NODE_ENV === 'test' || typeof jest !== 'undefined') {
    // In test mode, use process.cwd() as base to avoid import.meta issues
    return process.cwd();
  }
  
  // Check if __dirname is already available (CommonJS)
  // @ts-ignore - __dirname may be available in CommonJS
  if (typeof __dirname !== 'undefined') {
    // @ts-ignore
    return __dirname;
  }
  
  // In ESM mode, try to use import.meta
  try {
    // @ts-ignore - import.meta may not be available in all environments
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      // @ts-ignore
      const __filename = fileURLToPath(import.meta.url);
      return path.dirname(__filename);
    }
  } catch {
    // Fallback to process.cwd()
  }
  
  return process.cwd();
}

const baseDir = getBaseDir();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(baseDir, "..", "client", "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
