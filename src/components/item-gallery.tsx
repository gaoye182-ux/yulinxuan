"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { CollectionImage } from "@/lib/collection-data";
import type { Language } from "@/lib/i18n";

type ItemGalleryProps = {
  images: CollectionImage[];
  lang: Language;
  fallbackAlt: string;
  thumbnailsLabel: string;
};

export function ItemGallery({
  images,
  lang,
  fallbackAlt,
  thumbnailsLabel
}: ItemGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      images.findIndex((image) => image.isPrimary)
    )
  );
  const [isOpen, setIsOpen] = useState(false);
  const activeImage = images[activeIndex] ?? images[0];
  const activeAlt = activeImage.alt?.[lang] ?? fallbackAlt;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, isOpen]);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--border)] bg-[color:var(--ivory-dark)] md:aspect-[5/4] lg:aspect-[4/5]">
        <Image
          src={activeImage.url}
          alt={activeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center border border-[color:var(--gold)] bg-[rgba(255,253,248,0.92)] text-[color:var(--gold-dark)] transition hover:bg-[color:var(--gold)] hover:text-white"
          aria-label="Open image preview"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="mt-3">
        <p className="mb-3 text-xs tracking-[0.18em] text-[color:var(--gold-dark)]">
          {thumbnailsLabel}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image.url}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] overflow-hidden border bg-[color:var(--paper)] ${
                index === activeIndex ? "border-[color:var(--gold)]" : "border-[color:var(--border)]"
              }`}
              aria-label={image.alt?.[lang] ?? `${fallbackAlt} ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt?.[lang] ?? `${fallbackAlt} ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[rgba(26,26,26,0.92)] px-4 py-5"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center border border-white/30 bg-black/20 text-white"
            aria-label="Close image preview"
          >
            <X size={20} />
          </button>
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-4">
            <div className="relative min-h-0 flex-1">
              <Image
                src={activeImage.url}
                alt={activeAlt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-2">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`modal-${image.url}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`relative aspect-[4/3] overflow-hidden border ${
                    index === activeIndex ? "border-[color:var(--gold-light)]" : "border-white/25"
                  }`}
                  aria-label={image.alt?.[lang] ?? `${fallbackAlt} ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt?.[lang] ?? `${fallbackAlt} ${index + 1}`}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
