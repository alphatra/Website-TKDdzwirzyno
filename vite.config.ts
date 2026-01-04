import { defineConfig } from "vite";
// touch to force reload 3
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  ssr: {
    noExternal: ["sanitize-html"],
  },
});
