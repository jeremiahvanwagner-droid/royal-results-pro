import fs from "node:fs";
import { execSync } from "node:child_process";

// Hostinger (and some other Linux shared-hosting environments) installs
// node_modules correctly but forgets to set the executable bit on native
// binaries bundled inside pnpm's content-addressable store.  Fix it before
// we try to run esbuild so the deploy doesn't fail with EACCES.
if (process.platform === "linux") {
  try {
    execSync(
      "find node_modules/.pnpm -name 'esbuild' " +
        "-path '*/linux-x64/bin/esbuild' " +
        "-exec chmod +x {} \\;",
      { stdio: "pipe" }
    );
  } catch (_) {
    // Binary may not exist (prod install) – safe to ignore.
  }
}

// Smart build: if the pre-built dist/ is committed (production deploy path,
// e.g. Hostinger with --prod install), skip the build entirely. This avoids
// running esbuild on environments that block native-binary execution.
//
// Locally, where vite + esbuild are installed as devDeps, we run the full build.

const distReady =
  fs.existsSync("dist/index.js") &&
  fs.existsSync("dist/public/index.html");

let viteAvailable = false;
try {
  await import("vite");
  viteAvailable = true;
} catch (err) {
  if (err?.code !== "ERR_MODULE_NOT_FOUND") throw err;
}

if (!viteAvailable) {
  if (distReady) {
    console.log(
      "[build] Vite not installed (production install). Using committed dist/."
    );
    process.exit(0);
  }
  console.error(
    "[build] ERROR: Vite is not installed AND no pre-built dist/ was found.\n" +
      "Either install devDependencies (`pnpm install`) or run `pnpm build` locally\n" +
      "and commit the dist/ folder before deploying."
  );
  process.exit(1);
}

console.log("[build] Building client (vite) and server (esbuild)…");
execSync("vite build", { stdio: "inherit" });
execSync("node esbuild.config.mjs", { stdio: "inherit" });
