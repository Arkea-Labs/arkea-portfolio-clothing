"use client";

import React, { useState } from "react";
import { ColorVariant, GarmentProduct } from "@/data/catalog";

interface EditorialGarmentVisualProps {
  product: GarmentProduct;
  selectedColor: ColorVariant;
  showSecondaryAngle?: boolean;
  className?: string;
  aspectRatioClass?: string;
}

export function EditorialGarmentVisual({
  product,
  selectedColor,
  showSecondaryAngle = false,
  className = "",
  aspectRatioClass = "aspect-[3/4]",
}: EditorialGarmentVisualProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const activeSrc = showSecondaryAngle
    ? selectedColor.detailImageUrl
    : selectedColor.imageUrl;

  return (
    <div
      className={`relative overflow-hidden bg-pedra select-none ${aspectRatioClass} ${className}`}
    >
      {!imgFailed ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt={`${product.name} na tonalidade ${selectedColor.name}`}
            width={640}
            height={853}
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Subtle fabric tint atmospheric veil to harmonize editorial photography with the selected color swatch */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-15 transition-colors duration-500"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A1621]/25 via-transparent to-transparent opacity-60" />
        </>
      ) : (
        /* Editorial Atelier Fallback Illustration in case offline or blocked image */
        <div
          className="flex h-full w-full flex-col justify-between p-6"
          style={{
            background: `linear-gradient(155deg, #EFECE6 0%, ${selectedColor.hex}33 55%, #EFECE6 100%)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-ameixa/65">
            <span>{product.code}</span>
            <span>{product.category}</span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center py-6">
            <svg
              viewBox="0 0 180 220"
              className="h-40 w-32 text-ameixa/75"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M65 24C74 32 106 32 115 24L138 52L122 86L134 196H46L58 86L42 52L65 24Z"
                fill={selectedColor.hex}
                fillOpacity="0.65"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M72 28C72 58 108 58 108 28"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1="90"
                y1="52"
                x2="90"
                y2="196"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.4"
              />
            </svg>
            <p className="mt-3 font-serif text-lg italic text-ameixa">
              {selectedColor.name}
            </p>
          </div>

          <div className="border-t border-ameixa/15 pt-3 text-[11px] text-ameixa/75">
            {product.fabric}
          </div>
        </div>
      )}

      {/* Swatch & Fabric Pill at bottom-left */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 bg-galeria/90 px-2.5 py-1 text-[11px] font-medium text-ameixa backdrop-blur-sm">
          <span
            className="h-2.5 w-2.5 rounded-full border border-ameixa/25"
            style={{ backgroundColor: selectedColor.hex }}
          />
          {selectedColor.name}
        </span>
        <span className="bg-galeria/85 px-2 py-0.5 text-[11px] text-ameixa/80 backdrop-blur-sm">
          {product.code}
        </span>
      </div>
    </div>
  );
}
