"use client"; // Authenticated conversation creation; preview never writes to Firebase.
import { useState } from "react";
import { useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";
import { clientAuth } from "@/lib/firebase-client";
import { startThread } from "@/actions/inbox/threads";
import { useRouter } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
export function ContactHost({
  listingId,
  sample = false,
}: {
  listingId: string;
  sample?: boolean;
}) {
  const l = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="button contact-button"
        disabled={busy || sample}
        onClick={async () => {
          setError("");
          setBusy(true);
          try {
            await clientAuth.authStateReady();
            const user = clientAuth.currentUser;
            if (!user) {
              router.push(
                `/login?next=${encodeURIComponent(`/listings/${listingId}`)}`,
              );
              return;
            }
            const result = await startThread({
              idToken: await user.getIdToken(),
              listingId,
            });
            router.push(`/messages?thread=${result.threadId}`);
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : c(
                    l,
                    "Something went wrong. Please try again.",
                    "Bir hata oluştu. Lütfen tekrar deneyin.",
                  ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <MessageCircle size={19} />
        {c(
          l,
          busy ? "Opening conversation…" : "Message the host",
          busy ? "Sohbet açılıyor…" : "Ev sahibine mesaj gönder",
        )}
      </button>
      {sample && (
        <p className="booking-note">
          {c(
            l,
            "Sample home · Enquiries are disabled.",
            "Örnek ev · Başvurular kapalıdır.",
          )}
        </p>
      )}
      {error && (
        <p role="alert" className="feedback error">
          {error}
        </p>
      )}
    </>
  );
}
