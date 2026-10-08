/* eslint-disable @next/next/no-img-element -- Firebase and local gallery URLs use explicit sizing and lazy loading. */
"use client"; // Native dialog handles focus trap and Escape for the gallery.
import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Grid2X2, X, ChevronLeft, ChevronRight, House } from "lucide-react";
import { copy as c } from "@/lib/copy";
export function PhotoGallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const l = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const open = (i: number) => {
    setIndex(i);
    ref.current?.showModal();
  };
  if (!photos.length)
    return (
      <div className="empty-state">
        <House size={40} />
        {c(l, "Photos coming soon", "Fotoğraflar yakında")}
      </div>
    );
  return (
    <>
      <div className={`photo-gallery ${photos.length === 1 ? "single" : ""}`}>
        {photos.slice(0, 3).map((url, i) => (
          <button
            key={`${url}-${i}`}
            className={`gallery-photo photo-${i}`}
            onClick={() => open(i)}
            aria-label={c(
              l,
              `View photo ${i + 1}`,
              `${i + 1}. fotoğrafı göster`,
            )}
          >
            <img
              src={url}
              alt={`${title} · ${i + 1}`}
              width="1100"
              height="800"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </button>
        ))}
        <button
          className="gallery-all button button-small button-light"
          onClick={() => open(0)}
        >
          <Grid2X2 size={15} />
          {c(
            l,
            `All ${photos.length} photos`,
            `${photos.length} fotoğrafın tümü`,
          )}
        </button>
      </div>
      <dialog
        className="gallery-dialog"
        ref={ref}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setIndex((index + 1) % photos.length);
          if (e.key === "ArrowLeft")
            setIndex((index - 1 + photos.length) % photos.length);
        }}
        aria-label={c(l, "Property photos", "Ev fotoğrafları")}
      >
        <button
          className="gallery-close icon-button"
          onClick={() => ref.current?.close()}
          aria-label={c(l, "Close gallery", "Galeriyi kapat")}
        >
          <X />
        </button>
        <img src={photos[index]} alt={`${title} · ${index + 1}`} />
        <div className="gallery-navigation">
          <button
            className="icon-button"
            aria-label={c(l, "Previous photo", "Önceki fotoğraf")}
            onClick={() =>
              setIndex((index - 1 + photos.length) % photos.length)
            }
          >
            <ChevronLeft />
          </button>
          <span>
            {index + 1} / {photos.length}
          </span>
          <button
            className="icon-button"
            aria-label={c(l, "Next photo", "Sonraki fotoğraf")}
            onClick={() => setIndex((index + 1) % photos.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
