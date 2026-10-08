// Native Node.js: prints variable names only, never credentials or token values.
const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_SERVICE_ACCOUNT_KEY",
];
const preview =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
console.log(preview ? "Mode: sample preview" : "Mode: Firebase connection");
const emulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const missing = required.filter(
  (key) =>
    !(emulator && key === "FIREBASE_SERVICE_ACCOUNT_KEY") && !process.env[key],
);
if (missing.length)
  console.log(
    "Needed for a live installation:\n" +
      missing.map((key) => "  - " + key).join("\n"),
  );
if (
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !==
    process.env.FIREBASE_PROJECT_ID
) {
  console.error("Client and server Firebase project IDs differ.");
  process.exitCode = 1;
}
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (!key.private_key || !key.client_email) throw new Error();
    console.log("Service-account JSON structure: present");
  } catch {
    console.error("Service-account JSON is incomplete or invalid.");
    process.exitCode = 1;
  }
}
console.log(
  "AI assistant: " +
    (process.env.ANTHROPIC_API_KEY ? "configured" : "optional, disabled"),
);
console.log(
  "Phone SMS: provider integration still required for production verification.",
);
if (!preview && missing.length) process.exitCode = 1;
