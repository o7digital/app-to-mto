import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export default defineConfig({
  integrations: [react()],
  output: "static",
  devToolbar: { enabled: false },
  vite: { server: { allowedHosts: ["terminal.local"] } },
});
