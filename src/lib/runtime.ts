// A missing Firebase web config intentionally opens a clearly labelled preview.
// Configured installations never fall back to sample data on backend failures.
export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export function requireLiveMode() {
  if (isDemoMode)
    throw new Error("Sample preview: connect Firebase to use this feature.");
}
