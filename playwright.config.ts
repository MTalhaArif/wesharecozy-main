import { defineConfig, devices } from "@playwright/test";

if (
  !process.env.FIRESTORE_EMULATOR_HOST ||
  !process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  !process.env.FIREBASE_STORAGE_EMULATOR_HOST
) {
  throw new Error(
    "Run this suite through Firebase emulators:exec; it creates test accounts and listings.",
  );
}

// Run against Firebase emulators, never a live project:
//   firebase emulators:exec "pnpm test:e2e"
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
      NEXT_PUBLIC_DEMO_MODE: "false",
      NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-wesharecozy",
      FIREBASE_PROJECT_ID: "demo-wesharecozy",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-wesharecozy.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_APP_ID: "demo-app",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo-wesharecozy.appspot.com",
      FIREBASE_STORAGE_BUCKET: "demo-wesharecozy.appspot.com",
      FIREBASE_SERVICE_ACCOUNT_KEY: "",
      ANTHROPIC_API_KEY: "e2e-ui-only-placeholder",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
