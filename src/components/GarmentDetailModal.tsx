"use client";

import React, { useState, useEffect } from "react";
import { X, Ruler, Sparkles, ShieldCheck } from "lucide-react";
import {
  ColorVariant,
  formatBRL,
  GarmentProduct,
  GarmentSize,
  MAX_INSTALLMENTS,
  PIX_DISCOUNT_RATE,
} from "@/data/catalog";
import { EditorialGarmentVisual } from "./EditorialGarmentVisual";

interface GarmentDetailModalProps {
  product: GarmentProduct | null;
  initialColor?: ColorVariant;
  initialSize?: GarmentSize;
  onClose: () => void;
  onAddToBag: (
    product: GarmentProduct,
    size: GarmentSize,
    color: ColorVariant
  ) => void;
  onOpenSizeGuide: () => void;
}

export function GarmentDetailModal({
  product,
  initialColor,
  initialSize = "M",
  onClose,
  onAddToBag,
  onOpenSizeGuide,
}: GarmentDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    initialColor || (product ? product.colors[0] : null)
  );
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(initialSize);
  const [showSecondaryAngle, setShowSecondaryAngle] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor || product.colors[0]);
      setSelectedSize(initialSize);
      setShowSecondaryAngle(false);
    }
  }, [product, initialColor, initialSize]);

  if (!product || !selectedColor) return null;

  const pixPrice = product.price * (1 - PIX_DISCOUNT_RATE);
  const installmentPrice = product.price / MAX_INSTALLMENTS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ameixa/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-garment-title"
    >
      <div className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto border border-ameixa/15 bg-galeria text-ameixa shadow-2xl md:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center border border-ameixa/15 bg-galeria/90 text-ameixa transition-colors hover:bg-pedra"
          aria-label="Fechar ficha da peça"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Editorial Lookbook Visual */}
        <div className="flex flex-col justify-between bg-pedra p-5 md:col-span-6">
          <EditorialGarmentVisual
            product={product}
            selectedColor={selectedColor}
            showSecondaryAngle={showSecondaryAngle}
            aspectRatioClass="aspect-[3/4]"
          />

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowSecondaryAngle(false)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                !showSecondaryAngle
                  ? "bg-ameixa text-galeria"
                  : "bg-galeria/80 text-ameixa hover:bg-galeria"
              }`}
            >
              Silhueta principal
            </button>
            <button
              type="button"
              onClick={() => setShowSecondaryAngle(true)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                showSecondaryAngle
                  ? "bg-ameixa text-galeria"
                  : "bg-galeria/80 text-ameixa hover:bg-galeria"
              }`}
            >
              Detalhe & caimento
            </button>
          </div>
        </div>

        {/* Right Column: Atelier Dossier & Actions */}
        <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-figo">
              <span>{product.category}</span>
              <span>·</span>
              <span>Ref. {product.code}</span>
            </div>

            <h2
              id="modal-garment-title"
              className="mt-1.5 font-serif text-2xl font-normal leading-tight text-ameixa sm:text-3xl"
            >
              {product.name}
            </h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-3 border-b border-ameixa/12 pb-4 tabular-nums">
              <span className="text-2xl font-semibold text-ameixa">
                {formatBRL(product.price)}
              </span>
              <span className="bg-manteiga px-2.5 py-0.5 text-xs font-medium text-ameixa">
                {formatBRL(pixPrice)} no Pix (-10%)
              </span>
              <span className="w-full text-xs text-ameixa/70">
                ou em até {MAX_INSTALLMENTS}x de {formatBRL(installmentPrice)}{" "}
                sem juros via Stripe
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ameixa/85">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mt-5">
              <span className="text-xs font-medium text-ameixa">
                Tonalidade:{" "}
                <strong className="font-semibold text-figo">
                  {selectedColor.name}
                </strong>
              </span>
              <div className="mt-2 flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const active = color.id === selectedColor.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-all ${
                        active
                          ? "border-figo bg-pedra font-medium text-ameixa ring-1 ring-figo"
                          : "border-ameixa/15 bg-galeria text-ameixa/75 hover:border-ameixa/40"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-ameixa/25"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-ameixa">
                  Tamanho:{" "}
                  <strong className="font-semibold text-figo">
                    {selectedSize}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="inline-flex items-center gap-1 font-medium text-figo underline-offset-4 hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Tabela de medidas
                </button>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {product.sizes.map((size) => {
                  const active = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-figo text-galeria"
                          : "border border-ameixa/15 bg-galeria text-ameixa hover:bg-pedra"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atelier Material & Provenance Metadata */}
            <div className="mt-5 space-y-2 border-t border-ameixa/12 pt-4 text-xs text-ameixa/80">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-figo" />
                <div>
                  <span className="font-medium text-ameixa">Matéria-prima:</span>{" "}
                  {product.fabric} ({product.gramatura})
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-figo" />
                <div>
                  <span className="font-medium text-ameixa">Caimento:</span>{" "}
                  {product.fitNotes}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => {
                onAddToBag(product, selectedSize, selectedColor);
                onClose();
              }}
              className="w-full bg-ameixa py-3.5 text-sm font-medium text-galeria transition-colors hover:bg-figo"
            >
              Adicionar à sacola · {formatBRL(product.price)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
