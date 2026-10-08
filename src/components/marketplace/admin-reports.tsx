"use client"; // Admin-authorized report review.
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useLocale } from "next-intl";
import { clientAuth } from "@/lib/firebase-client";
import {
  getListingReports,
  closeListingReport,
  type ListingReport,
} from "@/actions/admin/listing-reports";
import { copy as c } from "@/lib/copy";
import { Link } from "@/i18n/navigation";
export function AdminReports() {
  const l = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  useEffect(
    () =>
      onAuthStateChanged(clientAuth, (u) => {
        setUser(u);
        if (u)
          void u
            .getIdToken()
            .then((idToken) => getListingReports({ idToken }))
            .then(setReports)
            .catch(() =>
              setError(
                c(
                  l,
                  "Admin access is required to load reports.",
                  "Bildirimleri görüntülemek için yönetici erişimi gerekir.",
                ),
              ),
            );
      }),
    [l],
  );
  return (
    <section className="mx-auto max-w-4xl p-8">
      <h2 className="text-xl font-semibold mb-5">
        {c(l, "Listing reports", "İlan bildirimleri")}
      </h2>
      {error && (
        <p role="alert" className="feedback error">
          {error}
        </p>
      )}
      {reports.length === 0 && !error && (
        <p className="feedback">
          {c(l, "No reports to review.", "İncelenecek bildirim yok.")}
        </p>
      )}
      {reports.map((r) => (
        <div className="rounded-xl border p-5 mb-3" key={r.id}>
          <div className="flex justify-between gap-4">
            <Link className="text-link" href={`/listings/${r.listingId}`}>
              {c(l, "View listing", "İlanı gör")} ↗
            </Link>
            <small>{r.status}</small>
          </div>
          <p className="text-sm whitespace-pre-wrap mb-4">{r.reason}</p>
          {r.status === "OPEN" && (
            <button
              className="button button-small button-outline"
              disabled={busy === r.id}
              onClick={async () => {
                if (!user) return;
                setBusy(r.id);
                try {
                  await closeListingReport({
                    idToken: await user.getIdToken(),
                    reportId: r.id,
                  });
                  setReports((prev) =>
                    prev.map((x) =>
                      x.id === r.id ? { ...x, status: "CLOSED" } : x,
                    ),
                  );
                } catch {
                  setError(
                    c(l, "Could not close report.", "Bildirim kapatılamadı."),
                  );
                } finally {
                  setBusy("");
                }
              }}
            >
              {c(l, "Mark reviewed", "İncelendi olarak işaretle")}
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
