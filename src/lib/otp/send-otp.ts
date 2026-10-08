// Development stub only. Production must never claim an SMS was delivered.
export async function sendOtp(phoneE164: string, code: string): Promise<void> {
  if (process.env.NODE_ENV === "production")
    throw new Error(
      "Phone verification is unavailable until an SMS provider is configured.",
    );
  console.log(`[DEV OTP] Verification code for ${phoneE164}: ${code}`);
}
