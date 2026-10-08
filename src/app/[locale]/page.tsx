import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  KeyRound,
  MessageCircle,
  ReceiptText,
  House,
  Ship,
  Compass,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SearchBar } from "@/components/marketplace/search-bar";
import { ListingCard } from "@/components/listing-card";
import { searchListings } from "@/lib/listings/search-listings";
import { copy as c } from "@/lib/copy";
import { isDemoMode } from "@/lib/runtime";
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  const listings = await searchListings({ limit: 4 });
  return (
    <>
      <section className="site-shell hero-wrap">
        <div className="hero">
          <Image
            className="hero-image"
            src="/images/istanbul.jpg"
            alt={c(l, "Istanbul and the Bosphorus", "İstanbul ve Boğaz")}
            fetchPriority="high"
            width="1800"
            height="1200"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              <span />{" "}
              {c(
                l,
                "ONE CITY. A PLACE FOR YOU.",
                "BİR ŞEHİR. SİZE AİT BİR YER.",
              )}
            </p>
            <h1>
              {c(l, "New city.", "Yeni bir şehir.")}
              <br />
              {c(l, "Your kind of home.", "Tam size göre bir ev.")}
            </h1>
            <p className="hero-description">
              {c(
                l,
                "Find a room, share a space, settle into Istanbul.",
                "Bir oda bulun, bir evi paylaşın, İstanbul’a yerleşin.",
              )}
              <br />
              {c(
                l,
                "Your next chapter starts with feeling at home.",
                "Yeni hikâyeniz, evinizde hissetmekle başlar.",
              )}
            </p>
            <a className="hero-discover" href="#homes">
              {c(l, "Discover your place", "Yerinizi keşfedin")}
              <ArrowDownIcon />
            </a>
          </div>
          <span className="hero-caption">
            <span /> İstanbul, Türkiye <span className="hero-caption-line" />{" "}
            {c(l, "Two continents. One home.", "İki kıta. Bir ev.")}
          </span>
        </div>
        <SearchBar locale={l} />
      </section>
      <div className="site-shell promise-row">
        <span>
          <House size={18} />
          {c(l, "Rooms & monthly rentals", "Odalar ve aylık kiralık evler")}
        </span>
        <span>
          <ReceiptText size={18} />
          {c(
            l,
            "See rent, bills & deposit",
            "Kira, fatura ve depozitoyu görün",
          )}
        </span>
        <span>
          <MessageCircle size={18} />
          {c(
            l,
            "Connect directly with hosts",
            "Ev sahipleriyle doğrudan görüşün",
          )}
        </span>
        <span className="small-local">
          {c(
            l,
            "Local living, made simpler.",
            "Şehirde yaşam artık daha kolay.",
          )}
        </span>
      </div>
      <section className="site-shell section" id="homes">
        <div className="section-heading">
          <div>
            <p className="eyebrow green">
              {c(l, "ROOM FOR YOUR NEXT CHAPTER", "YENİ HİKÂYENİZE YER AÇIN")}
            </p>
            <h2>
              {c(
                l,
                "Somewhere you can call home.",
                "Evim diyebileceğiniz bir yer.",
              )}
            </h2>
          </div>
          <Link className="text-link" href="/search">
            {c(l, "Explore all homes", "Tüm evleri keşfet")}
            <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="category-links">
          {[
            ["", c(l, "All spaces", "Tüm evler")],
            ["ROOM_IN_SHARED_FLAT", c(l, "Private rooms", "Özel odalar")],
            ["WHOLE_FLAT_SUBLET", c(l, "Entire apartments", "Tüm daireler")],
            ["FLATMATE_WANTED", c(l, "Find a flatmate", "Ev arkadaşı bul")],
          ].map(([type, title], i) => (
            <Link
              className={`category-pill ${i === 0 ? "selected" : ""}`}
              key={title}
              href={type ? `/search?type=${type}` : "/search"}
            >
              {title}
              {i === 0 && <span>↗</span>}
            </Link>
          ))}
        </div>
        {isDemoMode && (
          <p className="sample-note">
            {c(
              l,
              "A look around: these are sample homes with illustrative prices and photos.",
              "Bir ön bakış: bu evler, fiyatlar ve fotoğraflar örnek olarak gösterilmektedir.",
            )}
          </p>
        )}
        <div className="home-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={l} />
          ))}
        </div>
        {!listings.length && (
          <div className="empty-state">
            <House size={36} />
            <h3>
              {c(
                l,
                "Your city. Your first listing.",
                "Şehriniz. İlk ilanınız.",
              )}
            </h3>
            <p>
              {c(
                l,
                "We’re opening our doors in Istanbul. Have a space to share?",
                "İstanbul’da kapılarımızı açıyoruz. Paylaşacak bir yeriniz var mı?",
              )}
            </p>
            <Link className="button" href="/listings/new">
              {c(l, "List your space", "İlan ver")}
            </Link>
          </div>
        )}
      </section>
      <section className="neighborhood-section">
        <div className="site-shell section">
          <div className="section-heading">
            <div>
              <p className="eyebrow green">
                {c(l, "FIND YOUR SIDE OF THE CITY", "ŞEHİRDEKİ YERİNİZİ BULUN")}
              </p>
              <h2>
                {c(
                  l,
                  "Every neighborhood, a different feeling.",
                  "Her semtte başka bir his.",
                )}
              </h2>
            </div>
            <Link href="/neighborhoods" className="text-link">
              {c(l, "Meet Istanbul", "İstanbul’u tanıyın")}
              <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="district-grid">
            {[
              [
                "kadikoy",
                "Kadıköy",
                c(l, "Asian side", "Anadolu Yakası"),
                c(
                  l,
                  "Coffee, culture & a little sea air.",
                  "Kahve, kültür ve biraz deniz havası.",
                ),
                "01",
              ],
              [
                "besiktas",
                "Beşiktaş",
                c(l, "European side", "Avrupa Yakası"),
                c(
                  l,
                  "A lively rhythm, right by the water.",
                  "Denizin yanında canlı bir ritim.",
                ),
                "02",
              ],
              [
                "beyoglu",
                "Beyoğlu",
                c(l, "European side", "Avrupa Yakası"),
                c(
                  l,
                  "Old streets. New favorite corners.",
                  "Eski sokaklar. Yeni favori köşeler.",
                ),
                "03",
              ],
              [
                "uskudar",
                "Üsküdar",
                c(l, "Asian side", "Anadolu Yakası"),
                c(
                  l,
                  "Ferry rides and slower evenings.",
                  "Vapur yolculukları ve sakin akşamlar.",
                ),
                "04",
              ],
            ].map(([id, name, side, desc, n]) => (
              <Link
                key={id}
                href={`/search/${id}`}
                className={`district-card district-${n}`}
              >
                <div className="district-top">
                  <span>{side}</span>
                  <span>{n}</span>
                </div>
                <div className="district-art" aria-hidden="true">
                  {id === "uskudar" ? (
                    <Ship />
                  ) : id === "kadikoy" ? (
                    <Compass />
                  ) : id === "besiktas" ? (
                    <House />
                  ) : (
                    <KeyRound />
                  )}
                </div>
                <div>
                  <h3>
                    {name}
                    <MoveUpRight size={21} />
                  </h3>
                  <p>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="site-shell section how-section">
        <div>
          <p className="eyebrow green">
            {c(
              l,
              "LESS SEARCHING. MORE LIVING.",
              "DAHA AZ ARAMA. DAHA ÇOK YAŞAM.",
            )}
          </p>
          <h2>
            {c(
              l,
              "A simpler way to settle in.",
              "Yerleşmenin daha kolay bir yolu.",
            )}
          </h2>
          <Link className="text-link" href="/help">
            {c(l, "How WeShareCozy works", "WeShareCozy nasıl çalışır")}
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="how-steps">
          {[
            [
              c(l, "Find your fit", "Size uygun evi bulun"),
              c(
                l,
                "Explore homes by area, budget and move-in date. Save the ones you love.",
                "Evleri bölge, bütçe ve taşınma tarihine göre keşfedin. Beğendiklerinizi kaydedin.",
              ),
            ],
            [
              c(l, "Get to know the space", "Evi yakından tanıyın"),
              c(
                l,
                "Talk to the host. Ask about costs, house rules and arrange a viewing.",
                "Ev sahibiyle konuşun. Masrafları, ev kurallarını sorun ve evi görmek için anlaşın.",
              ),
            ],
            [
              c(l, "Make your next move", "Yeni hayatınıza adım atın"),
              c(
                l,
                "Confirm the details and your agreement directly with the host.",
                "Ayrıntıları ve sözleşmenizi doğrudan ev sahibiyle teyit edin.",
              ),
            ],
          ].map(([title, desc], i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="site-shell host-wrap">
        <div className="host-banner">
          <div>
            <p className="eyebrow">
              {c(
                l,
                "GOOD SPACES DESERVE GOOD COMPANY",
                "GÜZEL EVLER, GÜZEL PAYLAŞIMLAR",
              )}
            </p>
            <h2>
              {c(
                l,
                "Got a little room to share?",
                "Paylaşacak bir odanız var mı?",
              )}
            </h2>
            <p>
              {c(
                l,
                "Turn your available space into someone’s new beginning.",
                "Boş alanınız, bir başkasının yeni başlangıcı olsun.",
              )}
            </p>
            <Link className="button button-light" href="/listings/new">
              {c(l, "Become a host", "Ev sahibi olun")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <svg
            className="host-art"
            viewBox="0 0 250 210"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M35 100 125 22l90 78v95H35v-95Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M94 195v-72h62v72M58 112h21v28H58zM172 112h21v28h-21zM88 93l36-32 37 32"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M11 185h231M125 22V5" stroke="currentColor" />
          </svg>
        </div>
      </section>
    </>
  );
}
function ArrowDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export const dynamic = "force-dynamic";
