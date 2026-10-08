"use client"; // Host-owned fields are validated again by the Server Action.
import { useState } from "react";
import { useLocale } from "next-intl";
import { editListing } from "@/actions/listings/manage-listing";
import { clientAuth } from "@/lib/firebase-client";
import {
  listingEditSchema,
  AMENITIES,
} from "@/lib/schemas/listing-edit-schema";
import type { PublicListing } from "@/lib/listings/get-listing";
import { copy as c, amenityLabel } from "@/lib/copy";
export function ListingEditor({
  listing,
  onDone,
}: {
  listing: PublicListing;
  onDone: () => void;
}) {
  const l = useLocale();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="listing-editor"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setError("");
        setBusy(true);
        try {
          if (!clientAuth.currentUser) throw new Error("Please sign in again.");
          const values = listingEditSchema.parse({
            titleEn: f.get("titleEn"),
            titleTr: f.get("titleTr"),
            descriptionEn: f.get("descriptionEn"),
            descriptionTr: f.get("descriptionTr"),
            rentKurus: Math.round(Number(f.get("rent")) * 100),
            depositKurus: Math.round(Number(f.get("deposit")) * 100),
            billsStatus: f.get("billsStatus"),
            contractAvailable: f.has("contractAvailable"),
            depositReturnPolicy: f.get("depositReturnPolicy"),
            furnished: f.has("furnished"),
            availableFrom: String(f.get("availableFrom") || ""),
            minStayMonths: Number(f.get("minStayMonths") || 1),
            amenities: f.getAll("amenities"),
          });
          await editListing({
            idToken: await clientAuth.currentUser.getIdToken(),
            listingId: listing.id,
            values,
          });
          onDone();
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : c(l, "Could not save changes.", "Değişiklikler kaydedilemedi."),
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {(["titleEn", "titleTr", "descriptionEn", "descriptionTr"] as const).map(
        (key) => (
          <label className="form-field" key={key}>
            <span>
              {
                {
                  titleEn: c(l, "English title", "İngilizce başlık"),
                  titleTr: c(l, "Turkish title", "Türkçe başlık"),
                  descriptionEn: c(
                    l,
                    "English description",
                    "İngilizce açıklama",
                  ),
                  descriptionTr: c(l, "Turkish description", "Türkçe açıklama"),
                }[key]
              }
            </span>
            {key.startsWith("description") ? (
              <textarea
                name={key}
                defaultValue={listing[key]}
                required
                minLength={20}
                maxLength={4000}
              />
            ) : (
              <input
                name={key}
                defaultValue={listing[key]}
                required
                minLength={5}
                maxLength={120}
              />
            )}
          </label>
        ),
      )}
      <div className="editor-grid">
        <label className="form-field">
          <span>{c(l, "Rent / month (TRY)", "Aylık kira (TRY)")}</span>
          <input
            name="rent"
            type="number"
            min="1"
            step="0.01"
            defaultValue={listing.rentKurus / 100}
            required
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Deposit (TRY)", "Depozito (TRY)")}</span>
          <input
            name="deposit"
            type="number"
            min="0"
            step="0.01"
            defaultValue={listing.depositKurus / 100}
            required
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Available from", "Müsaitlik tarihi")}</span>
          <input
            name="availableFrom"
            type="date"
            defaultValue={listing.availableFrom}
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Minimum stay (months)", "Minimum süre (ay)")}</span>
          <input
            name="minStayMonths"
            type="number"
            min="1"
            max="36"
            defaultValue={listing.minStayMonths ?? 1}
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Bills", "Faturalar")}</span>
          <select
            name="billsStatus"
            defaultValue={listing.billsStatus ?? "EXCLUDED"}
          >
            <option value="INCLUDED">{c(l, "Included", "Dahil")}</option>
            <option value="EXCLUDED">{c(l, "Separate", "Hariç")}</option>
            <option value="PARTIAL">
              {c(l, "Partly included", "Kısmen dahil")}
            </option>
          </select>
        </label>
      </div>
      <label className="form-field">
        <span>{c(l, "Deposit return policy", "Depozito iade politikası")}</span>
        <textarea
          name="depositReturnPolicy"
          defaultValue={listing.depositReturnPolicy}
          required
          minLength={10}
          maxLength={1000}
        />
      </label>
      <div className="editor-checks">
        <label className="check-field">
          <input
            type="checkbox"
            name="furnished"
            defaultChecked={listing.furnished}
          />
          {c(l, "Furnished", "Eşyalı")}
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            name="contractAvailable"
            defaultChecked={listing.contractAvailable}
          />
          {c(l, "Contract available", "Sözleşme mevcut")}
        </label>
        {AMENITIES.map((a) => (
          <label className="check-field" key={a}>
            <input
              type="checkbox"
              name="amenities"
              value={a}
              defaultChecked={listing.amenities?.includes(a)}
            />
            {amenityLabel(a, l)}
          </label>
        ))}
      </div>
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {c(
          l,
          busy ? "Saving…" : "Save changes",
          busy ? "Kaydediliyor…" : "Değişiklikleri kaydet",
        )}
      </button>
    </form>
  );
}
