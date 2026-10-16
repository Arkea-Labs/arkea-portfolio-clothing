"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  CreditCard,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  calculateShippingByCep,
  CheckoutArchitectureMode,
  ColorVariant,
  formatBRL,
  FRETE_GRATIS_MINIMO,
  GarmentProduct,
  GarmentSize,
  PIX_DISCOUNT_RATE,
  ShippingQuote,
} from "@/data/catalog";

export interface BagItem {
  key: string;
  product: GarmentProduct;
  size: GarmentSize;
  color: ColorVariant;
  quantity: number;
}

interface ShoppingBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  cep: string;
  onCepChange: (cep: string) => void;
  shippingQuote: ShippingQuote | null;
  onApplyShippingQuote: (quote: ShippingQuote | null) => void;
  checkoutMode: CheckoutArchitectureMode;
  onProceedToCheckout: (preferredChannel?: "stripe" | "whatsapp") => void;
}

export function ShoppingBagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  cep,
  onCepChange,
  shippingQuote,
  onApplyShippingQuote,
  checkoutMode,
  onProceedToCheckout,
}: ShoppingBagDrawerProps) {
  const [cepError, setCepError] = useState<string>("");

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const remainingForFreeShipping = Math.max(0, FRETE_GRATIS_MINIMO - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FRETE_GRATIS_MINIMO) * 100)
  );

  const effectiveShippingCost =
    subtotal >= FRETE_GRATIS_MINIMO
      ? 0
      : shippingQuote
        ? shippingQuote.cost
        : 0;

  const totalWithShipping = subtotal + effectiveShippingCost;
  const totalPix = subtotal * (1 - PIX_DISCOUNT_RATE) + effectiveShippingCost;

  const handleCalculateCep = (e: React.FormEvent) => {
    e.preventDefault();
    const quote = calculateShippingByCep(cep, subtotal);
    if (!quote) {
      setCepError("Informe um CEP válido com 8 dígitos (ex: 01414-001).");
      onApplyShippingQuote(null);
      return;
    }
    setCepError("");
    onApplyShippingQuote(quote);
  };

  const handleQuickPresetCep = (presetCep: string) => {
    onCepChange(presetCep);
    setCepError("");
    const quote = calculateShippingByCep(presetCep, subtotal);
    onApplyShippingQuote(quote);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ameixa/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sacola-titulo"
    >
      <div className="flex h-full w-full max-w-md flex-col justify-between border-l border-ameixa/15 bg-pedra text-ameixa shadow-2xl">
        {/* Top Header */}
        <div className="border-b border-ameixa/12 bg-galeria px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-figo" />
              <h2
                id="sacola-titulo"
                className="font-serif text-2xl font-normal text-ameixa"
              >
                Sacola Casa Léa
              </h2>
              <span className="bg-manteiga px-2 py-0.5 text-xs font-medium tabular-nums text-ameixa">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center border border-ameixa/15 text-ameixa/75 transition-colors hover:bg-pedra hover:text-ameixa"
              aria-label="Fechar sacola"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free shipping milestone bar */}
          <div className="mt-4 bg-manteiga/70 p-3">
            <div className="flex items-center justify-between text-xs">
              {remainingForFreeShipping === 0 ? (
                <span className="font-medium text-ameixa">
                  Cortesia desbloqueada: Frete Grátis para todo o Brasil
                </span>
              ) : (
                <span className="text-ameixa/85">
                  Faltam{" "}
                  <strong className="font-semibold tabular-nums text-figo">
                    {formatBRL(remainingForFreeShipping)}
                  </strong>{" "}
                  para Frete Grátis (acima de R$ 450,00)
                </span>
              )}
              <span className="tabular-nums text-[11px] font-medium text-ameixa/70">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-ameixa/10">
              <div
                className="h-full bg-figo transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle Scrollable Area: Items + CEP Calculator */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-10 w-10 stroke-[1.2] text-ameixa/35" />
              <p className="mt-4 font-serif text-2xl text-ameixa">
                Sua sacola está vazia
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-ameixa/70">
                Explore os vestidos em linho puro, a alfaiataria fluida e as
                blusas em seda da coleção atual.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 bg-ameixa px-6 py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
              >
                Explorar coleção
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 border border-ameixa/10 bg-galeria p-3.5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-pedra">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.color.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-medium leading-snug text-ameixa">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          className="text-ameixa/45 transition-colors hover:text-figo"
                          aria-label={`Remover ${item.product.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ameixa/75">
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-ameixa/25"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                        <span>·</span>
                        <span>Tam. {item.size}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-ameixa/15 bg-pedra/60">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, -1)}
                          className="px-2 py-1 text-ameixa/80 hover:bg-pedra"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, 1)}
                          className="px-2 py-1 text-ameixa/80 hover:bg-pedra"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold tabular-nums text-ameixa">
                        {formatBRL(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* CEP Shipping Calculator */}
              <div className="mt-6 border border-ameixa/12 bg-galeria p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-ameixa">
                    <Truck className="h-3.5 w-3.5 text-figo" />
                    <span>Simulador de entrega por CEP</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickPresetCep("01414-001")}
                    className="text-[11px] text-figo underline-offset-2 hover:underline"
                  >
                    Usar CEP Jardins SP
                  </button>
                </div>

                <form onSubmit={handleCalculateCep} className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                      const formatted =
                        raw.length > 5
                          ? `${raw.slice(0, 5)}-${raw.slice(5)}`
                          : raw;
                      onCepChange(formatted);
                    }}
                    placeholder="00000-000"
                    className="flex-1 border border-ameixa/20 bg-pedra/40 px-3 py-2 text-xs tabular-nums text-ameixa placeholder:text-ameixa/40 focus:border-figo focus:outline-none"
                    aria-label="Digite seu CEP"
                  />
                  <button
                    type="submit"
                    className="bg-ameixa px-4 py-2 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                  >
                    Calcular
                  </button>
                </form>

                {cepError && (
                  <p className="mt-1.5 text-[11px] text-figo">{cepError}</p>
                )}

                {shippingQuote && (
                  <div className="mt-3 border-t border-ameixa/10 pt-2.5 text-xs">
                    <div className="flex items-center justify-between font-medium text-ameixa">
                      <span>{shippingQuote.carrier}</span>
                      <span className="tabular-nums text-figo">
                        {subtotal >= FRETE_GRATIS_MINIMO ||
                        shippingQuote.cost === 0
                          ? "Grátis"
                          : formatBRL(shippingQuote.cost)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-ameixa/70">
                      {shippingQuote.regionName} · Prazo estimado:{" "}
                      {shippingQuote.days}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Summary & Modular Checkout Trigger */}
        {items.length > 0 && (
          <div className="border-t border-ameixa/15 bg-galeria p-6">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-ameixa/75">
                <span>Subtotal das peças</span>
                <span className="tabular-nums">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ameixa/75">
                <span>Entrega estimada</span>
                <span className="tabular-nums">
                  {subtotal >= FRETE_GRATIS_MINIMO
                    ? "Cortesia (Frete Grátis)"
                    : shippingQuote
                      ? formatBRL(shippingQuote.cost)
                      : "A calcular no checkout"}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-ameixa/12 pt-2.5 text-sm font-semibold text-ameixa">
                <span>Total do pedido</span>
                <span className="tabular-nums text-base">
                  {formatBRL(totalWithShipping)}
                </span>
              </div>
              <div className="flex items-center justify-between bg-manteiga px-2.5 py-1.5 text-[11px] text-ameixa">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Sparkles className="h-3 w-3 text-figo" />
                  Valor no Pix com 10% de desconto
                </span>
                <strong className="tabular-nums font-semibold text-figo">
                  {formatBRL(totalPix)}
                </strong>
              </div>
            </div>

            {/* Dynamic Checkout Buttons based on active CheckoutArchitectureMode */}
            <div className="mt-4 space-y-2">
              {checkoutMode === "hybrid" && (
                <>
                  <button
                    type="button"
                    onClick={() => onProceedToCheckout("stripe")}
                    className="flex w-full items-center justify-center gap-2 bg-ameixa py-3 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pagar online (Stripe · 6x sem juros ou Pix -10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => onProceedToCheckout("whatsapp")}
                    className="flex w-full items-center justify-center gap-2 border border-ameixa/25 bg-pedra py-2.5 text-xs font-medium text-ameixa transition-colors hover:border-figo hover:text-figo"
                  >
                    <MessageCircle className="h-4 w-4 text-figo" />
                    Finalizar pelo WhatsApp com consultora
                  </button>
                </>
              )}

              {checkoutMode === "stripe" && (
                <button
                  type="button"
                  onClick={() => onProceedToCheckout("stripe")}
                  className="flex w-full items-center justify-center gap-2 bg-ameixa py-3.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                >
                  <CreditCard className="h-4 w-4" />
                  Finalizar pagamento online via Stripe
                </button>
              )}

              {checkoutMode === "whatsapp" && (
                <button
                  type="button"
                  onClick={() => onProceedToCheckout("whatsapp")}
                  className="flex w-full items-center justify-center gap-2 bg-figo py-3.5 text-xs font-medium text-galeria transition-colors hover:bg-ameixa"
                >
                  <MessageCircle className="h-4 w-4" />
                  Gerar pedido formatado para WhatsApp
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
