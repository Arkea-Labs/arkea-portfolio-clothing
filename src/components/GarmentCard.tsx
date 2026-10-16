"use client";

import React, { useState } from "react";
import { Check, Eye } from "lucide-react";
import {
  ColorVariant,
  formatBRL,
  GarmentProduct,
  GarmentSize,
  MAX_INSTALLMENTS,
  PIX_DISCOUNT_RATE,
} from "@/data/catalog";
import { EditorialGarmentVisual } from "./EditorialGarmentVisual";

interface GarmentCardProps {
  product: GarmentProduct;
  onAddToBag: (
    product: GarmentProduct,
    size: GarmentSize,
    color: ColorVariant
  ) => void;
  onInspectProduct: (
    product: GarmentProduct,
    size: GarmentSize,
    color: ColorVariant
  ) => void;
}

export function GarmentCard({
  product,
  onAddToBag,
  onInspectProduct,
}: GarmentCardProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<GarmentSize>("M");
  const [justAdded, setJustAdded] = useState(false);

  const pixPrice = product.price * (1 - PIX_DISCOUNT_RATE);
  const installmentValue = product.price / MAX_INSTALLMENTS;

  const handleAdd = () => {
    onAddToBag(product, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col justify-between border border-ameixa/12 bg-galeria transition-colors hover:border-ameixa/25">
      <div>
        {/* Portrait Lookbook Frame */}
        <div
          onClick={() =>
            onInspectProduct(product, selectedSize, selectedColor)
          }
          className="cursor-pointer"
        >
          <EditorialGarmentVisual
            product={product}
            selectedColor={selectedColor}
            aspectRatioClass="aspect-[3/4]"
          />
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Category & Fabric Provenance */}
          <div className="flex items-center justify-between gap-2 text-xs text-ameixa/80">
            <span>{product.category}</span>
            <span className="truncate">{product.fabric}</span>
          </div>

          {/* Garment Title */}
          <h3 className="mt-1.5 font-serif text-xl font-normal leading-snug text-ameixa">
            <button
              type="button"
              onClick={() =>
                onInspectProduct(product, selectedSize, selectedColor)
              }
              className="text-left transition-colors hover:text-figo"
            >
              {product.name}
            </button>
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ameixa/80">
            {product.editorialLead}
          </p>

          {/* Price Block in BRL with tabular-nums */}
          <div className="mt-3.5 border-t border-ameixa/10 pt-3 tabular-nums">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-semibold text-ameixa">
                {formatBRL(product.price)}
              </span>
              <span className="bg-manteiga px-2 py-0.5 text-[11px] font-medium text-ameixa">
                {formatBRL(pixPrice)} no Pix (-10%)
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-ameixa/80">
              Até {MAX_INSTALLMENTS}x de {formatBRL(installmentValue)} sem juros
            </p>
          </div>

          {/* Color Swatches */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[11px] text-ameixa/80">
              <span>Cor: {selectedColor.name}</span>
              <button
                type="button"
                onClick={() =>
                  onInspectProduct(product, selectedSize, selectedColor)
                }
                className="inline-flex items-center gap-1 text-figo hover:underline"
              >
                <Eye className="h-3 w-3" />
                Ficha técnica
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              {product.colors.map((color) => {
                const isSelected = color.id === selectedColor.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    aria-label={`Selecionar cor ${color.name}`}
                    aria-pressed={isSelected}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-transform ${
                      isSelected
                        ? "scale-110 border-figo ring-1 ring-figo ring-offset-1"
                        : "border-ameixa/25 hover:scale-105"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inline Size Selector (PP P M G) */}
          <div className="mt-3.5">
            <span className="block text-[11px] text-ameixa/80">
              Selecione o tamanho:
            </span>
            <div className="mt-1.5 grid grid-cols-4 gap-1.5" role="group" aria-label="Tamanhos disponíveis">
              {product.sizes.map((size) => {
                const isSelected = size === selectedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Selecionar tamanho ${size}`}
                    aria-pressed={isSelected}
                    className={`py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-figo text-galeria"
                        : "border border-ameixa/15 bg-pedra/50 text-ameixa hover:bg-pedra"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <button
          type="button"
          onClick={handleAdd}
          className={`flex w-full items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors ${
            justAdded
              ? "bg-figo text-galeria"
              : "bg-ameixa text-galeria hover:bg-figo"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Peça adicionada ({selectedSize})
            </>
          ) : (
            <span>Adicionar à sacola · Tam. {selectedSize}</span>
          )}
        </button>
      </div>
    </article>
  );
}
