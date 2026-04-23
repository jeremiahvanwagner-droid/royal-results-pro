import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["server/_core/index.ts"],
  platform: "node",
  packages: "external",
  bundle: true,
  format: "esm",
  outdir: "dist",
  // Replace NODE_ENV at build time so esbuild can tree-shake the dev-only
  // dynamic import of ./vite.js (and its vite/Manus devDep imports) entirely.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
