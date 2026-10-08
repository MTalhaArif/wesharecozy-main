export const copy = (locale: string, en: string, tr: string) =>
  locale === "tr" ? tr : en;
export const typeLabel = (type: string, locale: string) =>
  ({
    ROOM_IN_SHARED_FLAT: copy(locale, "Private room", "Özel oda"),
    WHOLE_FLAT_SUBLET: copy(locale, "Entire apartment", "Tüm daire"),
    SHORT_TERM_SUBLET: copy(
      locale,
      "Short-term sublet",
      "Kısa süreli kiralama",
    ),
    FLATMATE_WANTED: copy(locale, "Flatmate wanted", "Ev arkadaşı aranıyor"),
  })[type] ?? type;
export const money = (kurus: number, locale: string) =>
  new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(kurus / 100);
export const amenityLabel = (key: string, locale: string) =>
  ({
    wifi: "Wi-Fi",
    kitchen: copy(locale, "Kitchen", "Mutfak"),
    washer: copy(locale, "Washing machine", "Çamaşır makinesi"),
    workspace: copy(locale, "Workspace", "Çalışma alanı"),
    balcony: copy(locale, "Balcony", "Balkon"),
    heating: copy(locale, "Heating", "Isıtma"),
    elevator: copy(locale, "Elevator", "Asansör"),
  })[key] ?? key;
