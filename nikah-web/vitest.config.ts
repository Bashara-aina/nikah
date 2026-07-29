import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "server-only": fileURLToPath(new URL("./lib/tests/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "lib/phone.ts",
        "lib/slug.ts",
        "lib/waTemplates.ts",
        "lib/auth.ts",
        "lib/guestValidation.ts",
      ],
      thresholds: { branches: 100 },
    },
  },
});
