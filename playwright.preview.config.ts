import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/preview",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: process.env.PLAYWRIGHT_CHROMIUM_ARGS
        ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS)
        : [],
    },
  },
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/en",
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    {
      name: "preview-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
});
