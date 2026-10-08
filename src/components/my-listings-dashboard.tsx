"use client"; // Firebase Auth state check (redirect if signed out) + data fetch/mutation UI

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { ListingEditor } from "@/components/marketplace/listing-editor";
import { changeListingStatus } from "@/actions/listings/manage-listing";
import { isListingExpired } from "@/lib/listings/is-expired";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
import { useLocale, useTranslations } from "next-intl";
import { clientAuth } from "@/lib/firebase-client";
import { useRouter } from "@/i18n/navigation";
import { getMyListings } from "@/actions/listings/get-my-listings";
import {
  getMyInterestRequests,
  type HostInterestRequest,
} from "@/actions/interest/get-my-interest-requests";
import { resolveInterestRequest } from "@/actions/interest/resolve-interest-request";
import { submitHostRating } from "@/actions/interest/submit-host-rating";
import type { PublicListing } from "@/lib/listings/get-listing";
import { Button } from "@/components/ui/button";
import { RatingForm } from "@/components/rating-form";

export function MyListingsDashboard() {
  const locale = useLocale();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const t = useTranslations("MyListings");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [requests, setRequests] = useState<HostInterestRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(clientAuth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        router.push("/login");
        return;
      }
      try {
        const idToken = await nextUser.getIdToken();
        const [myListings, myRequests] = await Promise.all([
          getMyListings({ idToken }),
          getMyInterestRequests({ idToken }),
        ]);
        setListings(myListings);
        setRequests(myRequests);
      } catch {
        setError(
          c(
            locale,
            "Could not load your listings. Please refresh.",
            "İlanlar yüklenemedi. Lütfen yenileyin.",
          ),
        );
      } finally {
        setLoading(false);
      }
    });
  }, [router, locale]);

  const handleResolve = async (
    requestId: string,
    resolution: "DEAL_MADE" | "NOT_INTERESTED",
  ) => {
    if (!user) return;
    setBusy(requestId);
    setError("");
    try {
      const idToken = await user.getIdToken();
      await resolveInterestRequest({ idToken, requestId, resolution });
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: resolution }
            : request,
        ),
      );
    } catch {
      setError(
        c(
          locale,
          "Could not update request. Please try again.",
          "Talep güncellenemedi. Tekrar deneyin.",
        ),
      );
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground p-8">{t("loading")}</p>;
  }

  return (
    <div className="host-dashboard">
      {error && (
        <p role="alert" className="feedback error">
          {error}
        </p>
      )}
      <div className="dashboard-actions">
        <Link className="button" href="/listings/new">
          {c(locale, "Add a new space", "Yeni ilan ekle")}
        </Link>
        <Link className="button button-outline" href="/messages">
          {c(locale, "Open inbox", "Mesaj kutusunu aç")}
        </Link>
      </div>
      {user && (
        <p className="text-muted-foreground -mt-2">
          {t("welcome", { name: user.displayName || user.email || "" })}
        </p>
      )}

      {listings.length === 0 && (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      )}
      {listings.map((listing) => {
        const listingRequests = requests.filter(
          (request) => request.listingId === listing.id,
        );
        return (
          <div
            key={listing.id}
            className="bg-card flex flex-col gap-3 rounded-xl border p-4"
          >
            <div>
              <p className="font-medium">
                {locale === "tr" ? listing.titleTr : listing.titleEn}
              </p>
              <p className="text-muted-foreground text-xs">
                {listing.neighborhood} ·{" "}
                {listing.status === "PUBLISHED" &&
                isListingExpired(listing.publishedAt)
                  ? c(locale, "Expired", "Süresi doldu")
                  : listing.status}
              </p>
            </div>

            {listing.status !== "REMOVED" && (
              <div className="listing-manage-actions">
                <Link className="text-link" href={`/listings/${listing.id}`}>
                  {c(locale, "View listing", "İlanı gör")} ↗
                </Link>
                <button
                  className="button button-small button-outline"
                  onClick={() =>
                    setEditing(editing === listing.id ? null : listing.id)
                  }
                >
                  {c(
                    locale,
                    editing === listing.id ? "Close editor" : "Edit details",
                    editing === listing.id ? "Düzenleyiciyi kapat" : "Düzenle",
                  )}
                </button>
                <button
                  className="button button-small button-outline"
                  disabled={busy === listing.id}
                  onClick={async () => {
                    if (!user) return;
                    setBusy(listing.id);
                    setError("");
                    const action =
                      listing.status === "PUBLISHED" &&
                      !isListingExpired(listing.publishedAt)
                        ? "pause"
                        : "publish";
                    try {
                      await changeListingStatus({
                        idToken: await user.getIdToken(),
                        listingId: listing.id,
                        action,
                      });
                      setListings(
                        await getMyListings({
                          idToken: await user.getIdToken(),
                        }),
                      );
                    } catch {
                      setError(
                        c(
                          locale,
                          "Could not update listing.",
                          "İlan güncellenemedi.",
                        ),
                      );
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
                  {c(
                    locale,
                    listing.status === "PUBLISHED" &&
                      !isListingExpired(listing.publishedAt)
                      ? "Pause listing"
                      : "Publish / renew",
                    listing.status === "PUBLISHED" &&
                      !isListingExpired(listing.publishedAt)
                      ? "İlanı duraklat"
                      : "Yayınla / yenile",
                  )}
                </button>
              </div>
            )}
            {editing === listing.id && (
              <ListingEditor
                listing={listing}
                onDone={() => {
                  setEditing(null);
                  if (user)
                    void user
                      .getIdToken()
                      .then((idToken) => getMyListings({ idToken }))
                      .then(setListings)
                      .catch(() => setError("Could not refresh."));
                }}
              />
            )}
            {listingRequests.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("noRequests")}</p>
            )}
            {listingRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-2 rounded-lg border p-3"
              >
                <p className="text-sm">
                  {request.seekerName} · {request.seekerContact}
                </p>
                <p className="text-muted-foreground text-xs">
                  {t(`status.${request.status}`)}
                </p>

                {request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === request.id}
                      onClick={() => handleResolve(request.id, "DEAL_MADE")}
                    >
                      {t("dealMade")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === request.id}
                      onClick={() =>
                        handleResolve(request.id, "NOT_INTERESTED")
                      }
                    >
                      {t("notInterested")}
                    </Button>
                  </div>
                )}

                {request.status === "DEAL_MADE" && !request.hasHostRating && (
                  <RatingForm
                    heading={t("rateSeekerHeading")}
                    onSubmit={async (rating) => {
                      if (!user) return;
                      const idToken = await user.getIdToken();
                      await submitHostRating({
                        idToken,
                        requestId: request.id,
                        rating,
                      });
                      setRequests((prev) =>
                        prev.map((r) =>
                          r.id === request.id
                            ? { ...r, hasHostRating: true }
                            : r,
                        ),
                      );
                    }}
                  />
                )}
                {request.hasHostRating && (
                  <p className="text-muted-foreground text-xs">
                    {t("alreadyRated")}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
