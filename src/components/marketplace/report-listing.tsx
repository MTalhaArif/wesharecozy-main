"use client"; // Signed-in report form with explicit submit feedback.
import { useState } from "react";
import { Flag } from "lucide-react";
import { useLocale } from "next-intl";
import { reportListing } from "@/actions/listings/report-listing";
import { clientAuth } from "@/lib/firebase-client";
import { copy as c } from "@/lib/copy";
import { useRouter } from "@/i18n/navigation";
export function ReportListing({
  listingId,
  sample,
}: {
  listingId: string;
  sample?: boolean;
}) {
  const l = useLocale();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <details className="report-listing">
      <summary>
        <Flag size={14} />
        {c(l, "Report this listing", "İlanı bildir")}
      </summary>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (sample) {
            setFeedback(
              c(
                l,
                "Reports are disabled for sample homes.",
                "Örnek evler için bildirim kapalıdır.",
              ),
            );
            return;
          }
          const form = e.currentTarget;
          const reason = new FormData(form).get("reason");
          setBusy(true);
          try {
            await clientAuth.authStateReady();
            if (!clientAuth.currentUser) {
              router.push(
                `/login?next=${encodeURIComponent(`/listings/${listingId}`)}`,
              );
              return;
            }
            await reportListing({
              idToken: await clientAuth.currentUser.getIdToken(),
              listingId,
              reason,
            });
            setFeedback(
              c(
                l,
                "Your report is recorded for the admin to review.",
                "Bildiriminiz yönetici incelemesi için kaydedildi.",
              ),
            );
            form.reset();
          } catch {
            setFeedback(
              c(
                l,
                "Could not submit. Please try again later.",
                "Gönderilemedi. Daha sonra tekrar deneyin.",
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="form-field">
          <span>
            {c(l, "What should we look into?", "Neyi incelememizi istersiniz?")}
          </span>
          <textarea name="reason" minLength={10} maxLength={2000} required />
        </label>
        <button className="button button-small" disabled={busy || sample}>
          {c(l, "Submit report", "Bildirimi gönder")}
        </button>
        <p role="status">{feedback}</p>
      </form>
    </details>
  );
}
