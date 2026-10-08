"use client"; // Expandable filters keep every selection in the URL.
import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { copy as c, typeLabel } from "@/lib/copy";
import type { DistrictSeed } from "@/lib/districts/district-data";
export function SearchControls({
  locale: l,
  districts,
  filters: f,
}: {
  locale: string;
  districts: DistrictSeed[];
  filters: Record<string, string | undefined>;
}) {
  const [open, setOpen] = useState(
    Boolean(f.bills || f.furnished || f.rooms || f.minRent || f.amenity),
  );
  return (
    <form action={`/${l}/search`} className="search-controls">
      <div className="search-primary">
        <label className="form-field">
          <span>{c(l, "Neighborhood", "Semt")}</span>
          <select name="district" defaultValue={f.district ?? ""}>
            <option value="">
              {c(l, "Anywhere in Istanbul", "İstanbul’un her yeri")}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameTr}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>{c(l, "Space type", "Ev türü")}</span>
          <select name="type" defaultValue={f.type ?? ""}>
            <option value="">{c(l, "All spaces", "Tüm evler")}</option>
            {[
              "ROOM_IN_SHARED_FLAT",
              "WHOLE_FLAT_SUBLET",
              "FLATMATE_WANTED",
              "SHORT_TERM_SUBLET",
            ].map((t) => (
              <option value={t} key={t}>
                {typeLabel(t, l)}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>
            {c(l, "Maximum monthly rent (TRY)", "En yüksek aylık kira (TRY)")}
          </span>
          <input
            name="maxRent"
            type="number"
            min="0"
            placeholder={c(l, "Any budget", "Tüm bütçeler")}
            defaultValue={f.maxRent}
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Available by", "Bu tarihe kadar müsait")}</span>
          <input type="date" name="availableBy" defaultValue={f.availableBy} />
        </label>
        <button type="submit" className="button">
          <Search size={19} />
          <span>{c(l, "Search", "Ara")}</span>
        </button>
      </div>
      <div className="search-secondary">
        <button
          type="button"
          className="text-link"
          aria-expanded={open}
          aria-controls="extra-filters"
          onClick={() => setOpen(!open)}
        >
          <SlidersHorizontal size={16} />
          {c(l, "More filters", "Diğer filtreler")}
        </button>
        <label className="sort-control">
          {c(l, "Sort by", "Sırala")}
          <select name="sort" defaultValue={f.sort ?? "newest"}>
            <option value="newest">{c(l, "Newest first", "En yeni")}</option>
            <option value="price-asc">
              {c(l, "Price: low to high", "Fiyat: düşükten yükseğe")}
            </option>
            <option value="price-desc">
              {c(l, "Price: high to low", "Fiyat: yüksekten düşüğe")}
            </option>
          </select>
        </label>
      </div>
      <div id="extra-filters" className="extra-filters" hidden={!open}>
        <label className="form-field">
          <span>{c(l, "Minimum rent (TRY)", "En düşük kira (TRY)")}</span>
          <input
            name="minRent"
            type="number"
            min="0"
            defaultValue={f.minRent}
          />
        </label>
        <label className="form-field">
          <span>{c(l, "Rooms in the home", "Evdeki oda sayısı")}</span>
          <select name="rooms" defaultValue={f.rooms ?? ""}>
            <option value="">{c(l, "Any", "Tümü")}</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            name="bills"
            value="included"
            defaultChecked={f.bills === "included"}
          />
          {c(l, "Bills included", "Faturalar dahil")}
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            name="furnished"
            value="yes"
            defaultChecked={f.furnished === "yes"}
          />
          {c(l, "Furnished", "Eşyalı")}
        </label>
        <label className="check-field">
          <input
            type="checkbox"
            name="amenity"
            value="workspace"
            defaultChecked={f.amenity === "workspace"}
          />
          {c(l, "Workspace", "Çalışma alanı")}
        </label>
      </div>
    </form>
  );
}
