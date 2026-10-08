import { notFound } from "next/navigation";
import {
  MapPin,
  House,
  Armchair,
  CalendarDays,
  Check,
  ShieldCheck,
  ReceiptText,
  ArrowLeft,
} from "lucide-react";
import { getListing } from "@/lib/listings/get-listing";
import { isListingExpired } from "@/lib/listings/is-expired";
import { getHostRatingSummary } from "@/lib/interest/get-host-rating-summary";
import { ListingMapLoader } from "@/components/listing-map-loader";
import { InterestRequestForm } from "@/components/interest-request-form";
import { PhotoGallery } from "@/components/marketplace/photo-gallery";
import { ContactHost } from "@/components/marketplace/contact-host";
import { SaveButton } from "@/components/marketplace/save-button";
import { ReportListing } from "@/components/marketplace/report-listing";
import { Link } from "@/i18n/navigation";
import { copy as c, money, typeLabel, amenityLabel } from "@/lib/copy";
import { isDemoMode } from "@/lib/runtime";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ listingId: string; locale: string }>;
}) {
  const { listingId, locale } = await params;
  const l = await getListing(listingId);
  return {
    title: l ? (locale === "tr" ? l.titleTr : l.titleEn) : "Home unavailable",
    robots: isDemoMode ? { index: false, follow: false } : undefined,
  };
}
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string; locale: string }>;
}) {
  const { listingId, locale: l } = await params;
  const listing = await getListing(listingId);
  if (
    !listing ||
    listing.status !== "PUBLISHED" ||
    isListingExpired(listing.publishedAt)
  )
    notFound();
  const rating = listing.isSample
    ? null
    : await getHostRatingSummary(listing.ownerUid);
  const title = l === "tr" ? listing.titleTr : listing.titleEn;
  const description =
    l === "tr" ? listing.descriptionTr : listing.descriptionEn;
  const bills =
    listing.billsStatus === "INCLUDED"
      ? c(l, "Included", "Dahil")
      : listing.billsStatus === "PARTIAL"
        ? c(l, "Partly included", "Kısmen dahil")
        : listing.billsStatus === "EXCLUDED"
          ? c(l, "Paid separately", "Ayrıca ödenir")
          : c(l, "Ask the host", "Ev sahibine sorun");
  return (
    <div className="site-shell detail-page">
      <div className="detail-top">
        <Link className="text-link" href="/search">
          <ArrowLeft size={16} />
          {c(l, "Back to homes", "Evlere dön")}
        </Link>
        <SaveButton listing={listing} withLabel />
      </div>
      <div className="detail-title">
        <p className="eyebrow green">
          {typeLabel(listing.type, l)}{" "}
          {listing.isSample && ` · ${c(l, "SAMPLE HOME", "ÖRNEK EV")}`}
        </p>
        <h1>{title}</h1>
        <p>
          <MapPin size={15} />
          {listing.neighborhood}, İstanbul
          {rating && (
            <span>
              {" "}
              · ★ {rating.averageStars.toFixed(1)} ({rating.count}{" "}
              {c(l, "host ratings", "ev sahibi değerlendirmesi")})
            </span>
          )}
        </p>
      </div>
      <PhotoGallery photos={listing.photoUrls} title={title} />
      <div className="detail-columns">
        <div>
          <div className="detail-highlights">
            <span>
              <House />
              {listing.roomCount} {c(l, "rooms in the home", "odalı ev")}
            </span>
            {listing.furnished && (
              <span>
                <Armchair />
                {c(l, "Furnished", "Eşyalı")}
              </span>
            )}
            {listing.minStayMonths && (
              <span>
                <CalendarDays />
                {listing.minStayMonths} {c(l, "month minimum", "ay minimum")}
              </span>
            )}
          </div>
          <section className="prose-section">
            <h2>{c(l, "A little about this place", "Bu ev hakkında")}</h2>
            <p className="whitespace-pre-wrap">{description}</p>
            {listing.aboutText && (
              <p className="whitespace-pre-wrap mt-4">{listing.aboutText}</p>
            )}
          </section>
          {!!listing.amenities?.length && (
            <section className="prose-section">
              <h2>{c(l, "Make yourself comfortable", "Rahatınıza bakın")}</h2>
              <div className="amenities">
                {listing.amenities.map((a) => (
                  <span key={a}>
                    <Check size={17} />
                    {amenityLabel(a, l)}
                  </span>
                ))}
              </div>
            </section>
          )}
          <section className="prose-section">
            <h2>{c(l, "Know before you move", "Taşınmadan önce bilin")}</h2>
            <dl className="costs">
              <div>
                <dt>{c(l, "Monthly rent", "Aylık kira")}</dt>
                <dd>{money(listing.rentKurus, l)}</dd>
              </div>
              <div>
                <dt>
                  {c(l, "Refundable deposit terms", "Depozito iade şartları")}
                </dt>
                <dd>{money(listing.depositKurus, l)}</dd>
              </div>
              <div>
                <dt>{c(l, "Bills", "Faturalar")}</dt>
                <dd>{bills}</dd>
              </div>
              <div>
                <dt>{c(l, "Rental contract", "Kira sözleşmesi")}</dt>
                <dd>
                  {listing.contractAvailable === undefined
                    ? c(l, "Not stated", "Belirtilmedi")
                    : listing.contractAvailable
                      ? c(l, "Available", "Mevcut")
                      : c(l, "Not available", "Mevcut değil")}
                </dd>
              </div>
              {listing.availableFrom && (
                <div>
                  <dt>{c(l, "Available from", "Müsaitlik tarihi")}</dt>
                  <dd>
                    {new Date(
                      listing.availableFrom + "T12:00:00Z",
                    ).toLocaleDateString(l, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Europe/Istanbul",
                    })}
                  </dd>
                </div>
              )}
            </dl>
            {listing.depositReturnPolicy && (
              <p className="deposit-policy">
                {listing.isSample
                  ? c(
                      l,
                      "Sample policy: deposit returned after a joint inspection, minus any agreed deductions.",
                      "Örnek politika: depozito, ortak inceleme sonrasında kararlaştırılan kesintiler düşülerek iade edilir.",
                    )
                  : listing.depositReturnPolicy}
              </p>
            )}
          </section>
          <section className="prose-section">
            <h2>{c(l, "Get to know the neighborhood", "Semti tanıyın")}</h2>
            <p className="mb-5">
              {c(
                l,
                "The pin shows an approximate location. Arrange a viewing with the host to confirm the exact address.",
                "İşaret yaklaşık konumu gösterir. Tam adresi teyit etmek için ev sahibiyle görüşün.",
              )}
            </p>
            <ListingMapLoader
              lat={listing.jitteredLat}
              lng={listing.jitteredLng}
            />
          </section>
          <ReportListing listingId={listing.id} sample={listing.isSample} />
        </div>
        <aside>
          <div className="contact-card">
            <p className="contact-price">
              <strong>{money(listing.rentKurus, l)}</strong>
              <span> / {c(l, "month", "ay")}</span>
            </p>
            <p className="booking-note">
              {typeLabel(listing.type, l)} · {listing.neighborhood}
            </p>
            <div className="contact-costs">
              <span>
                {c(l, "Monthly bills", "Aylık faturalar")}
                <b>{bills}</b>
              </span>
              <span>
                {c(l, "One-time deposit", "Tek seferlik depozito")}
                <b>{money(listing.depositKurus, l)}</b>
              </span>
            </div>
            <ContactHost listingId={listing.id} sample={listing.isSample} />
            <p className="booking-note">
              {c(
                l,
                "Start with a conversation. No payment is taken on this site.",
                "Sohbet ederek başlayın. Bu sitede ödeme alınmaz.",
              )}
            </p>
            {!listing.isSample && (
              <details className="guest-enquiry">
                <summary>
                  {c(
                    l,
                    "Prefer to leave a contact request?",
                    "İletişim talebi bırakmak ister misiniz?",
                  )}
                </summary>
                <InterestRequestForm listingId={listing.id} />
              </details>
            )}
            <div className="contact-tip">
              <ShieldCheck size={22} />
              <p>
                {c(
                  l,
                  "View the home and confirm the host’s right to rent before paying a deposit.",
                  "Depozito ödemeden önce evi görün ve ev sahibinin kiralama yetkisini doğrulayın.",
                )}
              </p>
            </div>
          </div>
          <div className="detail-note">
            <ReceiptText size={19} />
            {c(
              l,
              "Details are provided by the host. Confirm all costs and terms together.",
              "Bilgiler ev sahibi tarafından sağlanır. Tüm masraf ve şartları birlikte teyit edin.",
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
