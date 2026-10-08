import { Search, MapPin, CalendarDays, Wallet } from "lucide-react";
import { copy as c } from "@/lib/copy";
import { ISTANBUL_DISTRICTS } from "@/lib/districts/district-data";
export function SearchBar({ locale }: { locale: string }) {
  return (
    <form action={`/${locale}/search`} className="hero-search">
      <label>
        <MapPin size={20} />
        <span>
          <b>{c(locale, "Where in Istanbul?", "İstanbul’un neresinde?")}</b>
          <select
            name="district"
            aria-label={c(locale, "District", "İlçe")}
            defaultValue=""
          >
            <option value="">
              {c(locale, "Explore all neighborhoods", "Tüm semtleri keşfet")}
            </option>
            {ISTANBUL_DISTRICTS.map((d) => (
              <option value={d.id} key={d.id}>
                {d.nameTr}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label>
        <CalendarDays size={20} />
        <span>
          <b>{c(locale, "Move-in date", "Taşınma tarihi")}</b>
          <input
            type="date"
            name="availableBy"
            aria-label={c(locale, "Move-in date", "Taşınma tarihi")}
          />
        </span>
      </label>
      <label>
        <Wallet size={20} />
        <span>
          <b>{c(locale, "Monthly budget", "Aylık bütçe")}</b>
          <select
            name="maxRent"
            aria-label={c(locale, "Monthly budget", "Aylık bütçe")}
            defaultValue=""
          >
            <option value="">
              {c(locale, "Add your budget", "Bütçenizi seçin")}
            </option>
            {[15000, 20000, 30000, 40000, 60000].map((n) => (
              <option key={n} value={n}>
                {c(locale, "Up to", "En fazla")} ₺{n.toLocaleString(locale)}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button className="button" type="submit">
        <Search size={20} />
        {c(locale, "Find a home", "Ev bul")}
      </button>
    </form>
  );
}
