import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import config from "./shared.config.ts";

export default defineConfig({
  plugins: [fresh(config)],
  resolve: {
    dedupe: ["preact", "preact/hooks", "@preact/signals"],
  },
});
