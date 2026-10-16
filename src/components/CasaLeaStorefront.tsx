"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Ruler,
  Sparkles,
  CreditCard,
  MessageCircle,
  Layers,
  Receipt,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  calculateShippingByCep,
  CATALOG_PRODUCTS,
  CategoryFilter,
  CheckoutArchitectureMode,
  ColorVariant,
  formatBRL,
  GarmentProduct,
  GarmentSize,
  ShippingQuote,
} from "@/data/catalog";
import dynamic from "next/dynamic";
import { GarmentCard } from "./GarmentCard";
import type { BagItem } from "./ShoppingBagDrawer";
import type { SavedOrderRecord } from "./ModularCheckoutModal";

const SizeGuideModal = dynamic(
  () => import("./SizeGuideModal").then((mod) => mod.SizeGuideModal),
  { ssr: false }
);
const GarmentDetailModal = dynamic(
  () => import("./GarmentDetailModal").then((mod) => mod.GarmentDetailModal),
  { ssr: false }
);
const ShoppingBagDrawer = dynamic(
  () => import("./ShoppingBagDrawer").then((mod) => mod.ShoppingBagDrawer),
  { ssr: false }
);
const ModularCheckoutModal = dynamic(
  () => import("./ModularCheckoutModal").then((mod) => mod.ModularCheckoutModal),
  { ssr: false }
);
const OrderHistoryModal = dynamic(
  () => import("./OrderHistoryModal").then((mod) => mod.OrderHistoryModal),
  { ssr: false }
);

const STORAGE_BAG_KEY = "casa_lea_bag_v1";
const STORAGE_ORDERS_KEY = "casa_lea_orders_v1";
const STORAGE_MODE_KEY = "casa_lea_checkout_mode_v1";

const CATEGORIES: CategoryFilter[] = [
  "Todas as peças",
  "Vestidos",
  "Alfaiataria",
  "Blusas & Seda",
  "Acessórios",
];

export function CasaLeaStorefront() {
  // Active Checkout Architecture Mode
  const [checkoutMode, setCheckoutMode] =
    useState<CheckoutArchitectureMode>("hybrid");

  // Category & Sorting state
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>("Todas as peças");
  const [sortBy, setSortBy] = useState<"editorial" | "price_asc" | "price_desc">(
    "editorial"
  );

  // Shopping Bag state (initialized with 2 curated garments so visitors can test immediately)
  const [bagItems, setBagItems] = useState<BagItem[]>(() => [
    {
      key: `${CATALOG_PRODUCTS[0].id}-M-${CATALOG_PRODUCTS[0].colors[0].id}`,
      product: CATALOG_PRODUCTS[0],
      size: "M",
      color: CATALOG_PRODUCTS[0].colors[0],
      quantity: 1,
    },
    {
      key: `${CATALOG_PRODUCTS[2].id}-P-${CATALOG_PRODUCTS[2].colors[0].id}`,
      product: CATALOG_PRODUCTS[2],
      size: "P",
      color: CATALOG_PRODUCTS[2].colors[0],
      quantity: 1,
    },
  ]);

  // CEP & Shipping state
  const [cep, setCep] = useState<string>("01414-001");
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(() =>
    calculateShippingByCep("01414-001", 768.9)
  );

  // Modals & Drawers state
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [preferredCheckoutChannel, setPreferredCheckoutChannel] = useState<
    "stripe" | "whatsapp"
  >("stripe");
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Inspected product for detail modal
  const [inspectedState, setInspectedState] = useState<{
    product: GarmentProduct | null;
    size: GarmentSize;
    color?: ColorVariant;
  }>({
    product: null,
    size: "M",
  });

  // Saved orders in localStorage
  const [savedOrders, setSavedOrders] = useState<SavedOrderRecord[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(
        STORAGE_MODE_KEY
      ) as CheckoutArchitectureMode | null;
      if (
        storedMode === "hybrid" ||
        storedMode === "stripe" ||
        storedMode === "whatsapp"
      ) {
        setCheckoutMode(storedMode);
      }

      const storedOrders = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        if (Array.isArray(parsedOrders)) {
          setSavedOrders(parsedOrders);
        }
      }

      const storedBag = localStorage.getItem(STORAGE_BAG_KEY);
      if (storedBag) {
        const parsedBag = JSON.parse(storedBag);
        if (Array.isArray(parsedBag) && parsedBag.length > 0) {
          setBagItems(parsedBag);
        }
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
  }, []);

  // Persist bag changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BAG_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore
    }
  }, [bagItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleModeChange = (mode: CheckoutArchitectureMode) => {
    setCheckoutMode(mode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {
      // Ignore
    }
    const modeNames: Record<CheckoutArchitectureMode, string> = {
      hybrid: "Checkout Híbrido (Stripe + WhatsApp) ativado",
      stripe: "Módulo Stripe Exclusivo ativado",
      whatsapp: "Módulo WhatsApp Exclusivo ativado",
    };
    showToast(modeNames[mode]);
  };

  const handleAddToBag = (
    product: GarmentProduct,
    size: GarmentSize,
    color: ColorVariant
  ) => {
    const itemKey = `${product.id}-${size}-${color.id}`;
    setBagItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          key: itemKey,
          product,
          size,
          color,
          quantity: 1,
        },
      ];
    });
    showToast(`${product.name} (Tam. ${size}) adicionado à sacola`);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleOpenCheckout = (preferredChannel?: "stripe" | "whatsapp") => {
    // Ensure bag has at least 1 item if user clicks "Testar checkout agora" with an empty bag
    if (bagItems.length === 0) {
      const defaultProduct = CATALOG_PRODUCTS[0];
      setBagItems([
        {
          key: `${defaultProduct.id}-M-${defaultProduct.colors[0].id}`,
          product: defaultProduct,
          size: "M",
          color: defaultProduct.colors[0],
          quantity: 1,
        },
      ]);
    }

    if (preferredChannel) {
      setPreferredCheckoutChannel(preferredChannel);
    } else if (checkoutMode === "whatsapp") {
      setPreferredCheckoutChannel("whatsapp");
    } else {
      setPreferredCheckoutChannel("stripe");
    }

    setIsBagOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: SavedOrderRecord) => {
    setSavedOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleClearOrderHistory = () => {
    setSavedOrders([]);
    try {
      localStorage.removeItem(STORAGE_ORDERS_KEY);
    } catch {
      // Ignore
    }
  };

  // Filtered and sorted products
  const filteredProducts = CATALOG_PRODUCTS.filter((p) =>
    activeCategory === "Todas as peças" ? true : p.category === activeCategory
  ).sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0;
  });

  const totalBagCount = bagItems.reduce((sum, i) => sum + i.quantity, 0);
  const bagSubtotal = bagItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const heroDress = CATALOG_PRODUCTS[0]; // Vestido Midi Linho Puro Celina
  const heroBlazer = CATALOG_PRODUCTS[1]; // Blazer Alfaiataria Linho Valentina

  return (
    <div className="min-h-screen bg-galeria text-ameixa selection:bg-manteiga selection:text-ameixa">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 border border-ameixa/20 bg-ameixa px-4 py-3 text-xs font-medium text-galeria shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-manteiga" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP DEMO ARCHITECTURE CONTROL BAR (Manteiga Suave #F3E9D2) */}
      <aside
        aria-label="Controle de Arquitetura de Pagamento"
        className="border-b border-ameixa/15 bg-manteiga px-4 py-2.5 text-xs text-ameixa"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2.5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-ameixa px-2 py-0.5 text-[11px] font-medium text-galeria">
              <Layers className="h-3 w-3" />
              Arquitetura de Pagamento Plugável
            </span>
            <span className="text-ameixa/85">
              Alterne em tempo real o motor de checkout da loja:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleModeChange("hybrid")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                checkoutMode === "hybrid"
                  ? "bg-figo text-galeria"
                  : "border border-ameixa/20 bg-galeria/80 text-ameixa hover:bg-galeria"
              }`}
            >
              1. Híbrido (Stripe + WhatsApp)
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("stripe")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                checkoutMode === "stripe"
                  ? "bg-figo text-galeria"
                  : "border border-ameixa/20 bg-galeria/80 text-ameixa hover:bg-galeria"
              }`}
            >
              2. Módulo Stripe Exclusivo
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("whatsapp")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                checkoutMode === "whatsapp"
                  ? "bg-figo text-galeria"
                  : "border border-ameixa/20 bg-galeria/80 text-ameixa hover:bg-galeria"
              }`}
            >
              3. Módulo WhatsApp Exclusivo
            </button>

            <span className="mx-1 hidden h-4 w-px bg-ameixa/20 sm:inline-block" />

            <button
              type="button"
              onClick={() => handleOpenCheckout()}
              className="border border-ameixa bg-ameixa px-3 py-1 text-xs font-medium text-galeria transition-colors hover:bg-figo"
            >
              Testar checkout agora
            </button>

            <button
              type="button"
              onClick={() => setIsOrderHistoryOpen(true)}
              className="inline-flex items-center gap-1 border border-ameixa/25 bg-galeria px-2.5 py-1 text-xs font-medium text-ameixa hover:bg-pedra"
            >
              <Receipt className="h-3 w-3 text-figo" />
              Pedidos ({savedOrders.length})
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN BOUTIQUE HEADER */}
      <header className="sticky top-0 z-30 border-b border-ameixa/12 bg-galeria/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Brand Identity */}
          <div className="flex items-baseline gap-3">
            <a
              href="#top"
              className="font-serif text-2xl font-normal tracking-tight text-ameixa sm:text-3xl"
            >
              Casa Léa
            </a>
            <span className="hidden text-xs text-ameixa/65 sm:inline-block">
              Atelier Feminino · São Paulo
            </span>
          </div>

          {/* Center Navigation */}
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 text-xs font-medium text-ameixa/80 md:flex"
          >
            <a
              href="#colecao"
              className="transition-colors hover:text-figo"
            >
              Coleção Solar
            </a>
            <a
              href="#arquitetura-checkout"
              className="transition-colors hover:text-figo"
            >
              Módulos de Checkout
            </a>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-figo"
            >
              <Ruler className="h-3.5 w-3.5 text-figo" />
              Tabela de medidas
            </button>
            <a
              href="#atelier-origem"
              className="transition-colors hover:text-figo"
            >
              Matéria-prima & Atelier
            </a>
          </nav>

          {/* Right Actions: Size Guide (mobile) + Shopping Bag */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-1 border border-ameixa/15 px-2.5 py-2 text-xs text-ameixa md:hidden"
              aria-label="Abrir tabela de medidas"
            >
              <Ruler className="h-3.5 w-3.5 text-figo" />
              <span>Medidas</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="inline-flex items-center gap-2.5 bg-ameixa px-4 py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Sacola</span>
              <span className="bg-manteiga px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ameixa">
                {totalBagCount}
              </span>
              <span className="hidden border-l border-galeria/25 pl-2 tabular-nums sm:inline">
                {formatBRL(bagSubtotal)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. ASYMMETRIC EDITORIAL HERO SECTION */}
      <section
        id="top"
        className="border-b border-ameixa/12 bg-galeria"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12">
          {/* Left 5 Columns: Editorial Manifesto & Collection Intro */}
          <div className="flex flex-col justify-between border-b border-ameixa/12 p-6 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-2 bg-pedra px-3 py-1 text-xs text-ameixa/85">
                <MapPin className="h-3.5 w-3.5 text-figo" />
                <span>Coleção Verão 2026 · Jardins, São Paulo</span>
              </div>

              <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.12] text-ameixa sm:text-5xl">
                A leveza do linho puro e a precisão da alfaiataria fluida.
              </h1>

              <p className="mt-5 text-sm leading-relaxed text-ameixa/80">
                Peças femininas desenhadas em nosso atelier em São Paulo com
                linho belga certificado, seda mulberry 19 momme e algodão
                egípcio fio 80. Formas pensadas para acompanhar o movimento do
                corpo com frescor e permanência.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#colecao"
                  className="bg-ameixa px-6 py-3.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                >
                  Explorar as 8 peças da coleção
                </a>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-2 border border-ameixa/25 bg-pedra px-5 py-3.5 text-xs font-medium text-ameixa transition-colors hover:border-figo hover:text-figo"
                >
                  <Ruler className="h-3.5 w-3.5 text-figo" />
                  Descobrir meu tamanho
                </button>
              </div>
            </div>

            {/* Bottom Atelier Highlights inside Hero Left */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-ameixa/12 pt-6 text-xs">
              <div>
                <p className="font-semibold text-ameixa">
                  Frete Grátis acima de R$ 450,00
                </p>
                <p className="mt-0.5 text-ameixa/70">
                  Envio segurado para todo o Brasil e mensageiro em SP.
                </p>
              </div>
              <div>
                <p className="font-semibold text-figo">
                  10% de desconto no Pix
                </p>
                <p className="mt-0.5 text-ameixa/70">
                  Ou em até 6x sem juros no cartão via Stripe ou WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Dual Lookbook Editorial Composition */}
          <div className="grid grid-cols-1 bg-pedra p-6 sm:grid-cols-12 sm:gap-6 sm:p-10 lg:col-span-7">
            {/* Primary Lookbook Plate (7 cols) */}
            <div className="flex flex-col justify-between sm:col-span-7">
              <div className="relative aspect-[3/4] overflow-hidden border border-ameixa/12 bg-galeria">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroDress.colors[0].imageUrl}
                  alt={`Lookbook: ${heroDress.name} confeccionado em ${heroDress.fabric}`}
                  width={640}
                  height={853}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1621]/45 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-galeria/95 p-4 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-[11px] text-figo">
                    <span>Lookbook 01 · {heroDress.code}</span>
                    <span>{heroDress.fabric}</span>
                  </div>
                  <p className="mt-1 font-serif text-xl text-ameixa">
                    {heroDress.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold tabular-nums text-ameixa">
                      {formatBRL(heroDress.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToBag(heroDress, "M", heroDress.colors[0])
                      }
                      className="bg-ameixa px-3 py-1.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                    >
                      Adicionar (Tam. M)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Lookbook Plate & Material Note (5 cols) */}
            <div className="mt-6 flex flex-col justify-between sm:col-span-5 sm:mt-0">
              <div className="border border-ameixa/12 bg-galeria p-4">
                <div className="aspect-[4/5] overflow-hidden bg-pedra">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroBlazer.colors[0].imageUrl}
                    alt={`Lookbook: ${heroBlazer.name} confeccionado em ${heroBlazer.fabric}`}
                    width={480}
                    height={600}
                    decoding="async"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-[11px] text-figo">
                  Lookbook 02 · Alfaiataria Fluida
                </p>
                <p className="mt-0.5 font-serif text-lg text-ameixa">
                  {heroBlazer.name}
                </p>
                <p className="mt-1 text-xs tabular-nums text-ameixa/80">
                  {formatBRL(heroBlazer.price)} · 6x de{" "}
                  {formatBRL(heroBlazer.price / 6)}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setInspectedState({
                      product: heroBlazer,
                      size: "M",
                      color: heroBlazer.colors[0],
                    })
                  }
                  className="mt-3 w-full border border-ameixa/20 bg-pedra py-2 text-xs font-medium text-ameixa transition-colors hover:bg-ameixa hover:text-galeria"
                >
                  Ver ficha de alfaiataria
                </button>
              </div>

              <div className="mt-4 border border-ameixa/12 bg-manteiga p-4 text-xs text-ameixa">
                <p className="font-serif text-base italic text-ameixa">
                  “Desenhamos roupas para mulheres que valorizam o toque da
                  fibra natural na pele e a tranquilidade de um corte que não
                  precisa de esforço.”
                </p>
                <p className="mt-2 text-[11px] font-medium text-figo">
                  Léa Vasconcelos · Direção Criativa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED CATALOG SECTION (8 FEMININE GARMENTS) */}
      <section
        id="colecao"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-ameixa/12 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs text-figo">
              Curadoria completa · 8 peças autorais em edição limitada
            </p>
            <h2 className="mt-1 font-serif text-3xl font-normal text-ameixa sm:text-4xl">
              Guarda-roupa de estação Casa Léa
            </h2>
          </div>

          {/* Sort & Size Guide Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-ameixa/70" htmlFor="ordenar-select">
              Ordenar por:
            </label>
            <select
              id="ordenar-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "editorial" | "price_asc" | "price_desc"
                )
              }
              className="border border-ameixa/20 bg-pedra px-3 py-2 text-xs text-ameixa focus:border-figo focus:outline-none"
            >
              <option value="editorial">Curadoria Editorial</option>
              <option value="price_asc">Menor valor (R$)</option>
              <option value="price_desc">Maior valor (R$)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar peças por categoria"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              const count =
                category === "Todas as peças"
                  ? CATALOG_PRODUCTS.length
                  : CATALOG_PRODUCTS.filter((p) => p.category === category)
                      .length;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "bg-ameixa text-galeria"
                      : "border border-ameixa/15 bg-pedra text-ameixa hover:border-ameixa/35"
                  }`}
                >
                  {category}{" "}
                  <span className="ml-1 opacity-70 tabular-nums">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-manteiga px-3 py-1.5 text-xs text-ameixa">
            <Sparkles className="h-3.5 w-3.5 text-figo" />
            <span>
              Selecione a cor e o tamanho (PP, P, M ou G) diretamente em cada
              peça
            </span>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <GarmentCard
              key={product.id}
              product={product}
              onAddToBag={handleAddToBag}
              onInspectProduct={(prod, size, color) =>
                setInspectedState({ product: prod, size, color })
              }
            />
          ))}
        </div>
      </section>

      {/* 5. PLUGGABLE PAYMENT ENGINE ARCHITECTURE SHOWCASE SECTION */}
      <section
        id="arquitetura-checkout"
        className="border-y border-ameixa/12 bg-pedra py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-figo">
              Engenharia de Conversão para Moda de Luxo
            </p>
            <h2 className="mt-1 font-serif text-3xl font-normal text-ameixa sm:text-4xl">
              Arquitetura de pagamento modular: Stripe, WhatsApp ou Híbrido
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ameixa/80">
              No mercado brasileiro de moda feminina autoral, parte das clientes
              prefere a rapidez do checkout transparente com Pix ou cartão em
              6x sem juros, enquanto outra parte valoriza confirmar medidas e
              bainha com uma consultora pelo WhatsApp. A Casa Léa suporta os
              três cenários sem alterar uma linha de código do catálogo.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Module 1: Hybrid */}
            <div
              className={`flex flex-col justify-between border p-6 transition-all ${
                checkoutMode === "hybrid"
                  ? "border-figo bg-galeria ring-1 ring-figo"
                  : "border-ameixa/15 bg-galeria/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-manteiga px-2.5 py-1 text-xs font-semibold text-ameixa">
                    Modo 01 · Híbrido
                  </span>
                  {checkoutMode === "hybrid" && (
                    <span className="bg-figo px-2 py-0.5 text-[11px] text-galeria">
                      Ativo na loja
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-serif text-2xl font-normal text-ameixa">
                  Checkout Híbrido (Stripe + WhatsApp)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ameixa/80">
                  Na sacola e no modal de finalização, a cliente escolhe
                  livremente entre pagar online imediatamente via Stripe ou
                  enviar a sacola formatada para uma consultora no WhatsApp.
                </p>
              </div>
              <div className="mt-6 flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    handleModeChange("hybrid");
                    handleOpenCheckout("stripe");
                  }}
                  className="w-full bg-ameixa py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                >
                  Ativar e testar modo híbrido
                </button>
              </div>
            </div>

            {/* Module 2: Exclusive Stripe */}
            <div
              className={`flex flex-col justify-between border p-6 transition-all ${
                checkoutMode === "stripe"
                  ? "border-figo bg-galeria ring-1 ring-figo"
                  : "border-ameixa/15 bg-galeria/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-manteiga px-2.5 py-1 text-xs font-semibold text-ameixa">
                    <CreditCard className="h-3 w-3 text-figo" />
                    Modo 02 · Stripe Exclusivo
                  </span>
                  {checkoutMode === "stripe" && (
                    <span className="bg-figo px-2 py-0.5 text-[11px] text-galeria">
                      Ativo na loja
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-serif text-2xl font-normal text-ameixa">
                  Módulo Stripe Exclusivo
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ameixa/80">
                  Operação 100% self-service integrada à rota{" "}
                  <code className="font-mono">/api/checkout/stripe</code>.
                  Suporta cartão em até 6x sem juros e Pix com 10% de desconto
                  automático e geração de código Copia e Cola.
                </p>
              </div>
              <div className="mt-6 flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    handleModeChange("stripe");
                    handleOpenCheckout("stripe");
                  }}
                  className="w-full bg-ameixa py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                >
                  Ativar e abrir Stripe Sheet
                </button>
              </div>
            </div>

            {/* Module 3: Exclusive WhatsApp */}
            <div
              className={`flex flex-col justify-between border p-6 transition-all ${
                checkoutMode === "whatsapp"
                  ? "border-figo bg-galeria ring-1 ring-figo"
                  : "border-ameixa/15 bg-galeria/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-manteiga px-2.5 py-1 text-xs font-semibold text-ameixa">
                    <MessageCircle className="h-3 w-3 text-figo" />
                    Modo 03 · WhatsApp Exclusivo
                  </span>
                  {checkoutMode === "whatsapp" && (
                    <span className="bg-figo px-2 py-0.5 text-[11px] text-galeria">
                      Ativo na loja
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-serif text-2xl font-normal text-ameixa">
                  Módulo WhatsApp Concierge
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ameixa/80">
                  Ideal para lançamentos cápsula e peças sob medida. Compila
                  automaticamente referências, tamanhos (PP/P/M/G), cores, CEP e
                  desconto Pix em uma mensagem estruturada{" "}
                  <code className="font-mono">#LEA-2048</code>.
                </p>
              </div>
              <div className="mt-6 flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    handleModeChange("whatsapp");
                    handleOpenCheckout("whatsapp");
                  }}
                  className="w-full bg-figo py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-ameixa"
                >
                  Ativar e ver mensagem WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ATELIER & MATERIAL PROVENANCE SECTION */}
      <section
        id="atelier-origem"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs text-figo">
              Rastreabilidade & Ofício Manual
            </p>
            <h2 className="mt-1 font-serif text-3xl font-normal text-ameixa">
              Matéria-prima nobre pensada para o clima brasileiro
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ameixa/80">
              Cada coleção Casa Léa nasce no nosso atelier na Rua Oscar Freire,
              combinando fibras naturais respiráveis com acabamentos internos de
              alfaiataria clássica — costura francesa, botões de madrepérola e
              forros em cambraia 100% algodão.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-7">
            <div className="border border-ameixa/12 bg-pedra p-5">
              <Sparkles className="h-4 w-4 text-figo" />
              <h3 className="mt-3 font-serif text-xl text-ameixa">
                Linho Puro Certificado
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ameixa/75">
                Fibras longas cultivadas sem irrigação artificial, pré-lavadas
                para garantir toque macio e zero encolhimento.
              </p>
            </div>

            <div className="border border-ameixa/12 bg-pedra p-5">
              <ShieldCheck className="h-4 w-4 text-figo" />
              <h3 className="mt-3 font-serif text-xl text-ameixa">
                Seda Mulberry 19 Momme
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ameixa/75">
                Fiação sericícola do Vale do Paraíba com gramatura encorpada que
                não marca e preserva o brilho acetinado natural.
              </p>
            </div>

            <div className="border border-ameixa/12 bg-pedra p-5">
              <Ruler className="h-4 w-4 text-figo" />
              <h3 className="mt-3 font-serif text-xl text-ameixa">
                Bainha Cortesia no Atelier
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ameixa/75">
                Informe sua altura no checkout pelo WhatsApp ou Stripe e
                receba sua pantalona ou vestido longo ajustado para você.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-ameixa/15 bg-ameixa text-galeria">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <p className="font-serif text-2xl font-normal text-galeria">
                Casa Léa · Atelier Feminino
              </p>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-galeria/75">
                Moda feminina contemporânea em linho puro, seda e alfaiataria
                fluida. Rua Oscar Freire, 1140 — Jardins, São Paulo · SP.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-manteiga">
                Atendimento & Concierge
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-galeria/80">
                <li>Segunda a Sábado, das 10h às 19h</li>
                <li>WhatsApp Atelier: +55 (11) 99824-1920</li>
                <li>Frete Grátis acima de R$ 450,00</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-manteiga">
                Acesso Rápido
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-galeria/80">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="hover:text-manteiga hover:underline"
                  >
                    Tabela de Medidas Feminina (PP ao G)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout()}
                    className="hover:text-manteiga hover:underline"
                  >
                    Simulador de Checkout ({checkoutMode.toUpperCase()})
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsOrderHistoryOpen(true)}
                    className="hover:text-manteiga hover:underline"
                  >
                    Histórico de Pedidos ({savedOrders.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-galeria/15 pt-6 text-[11px] text-galeria/60 sm:flex-row sm:items-center">
            <span>
              © 2026 Casa Léa Atelier Feminino Ltda. CNPJ 42.819.304/0001-18 ·
              São Paulo, Brasil.
            </span>
            <span>
              Showcase E-commerce · Motor de Pagamento Híbrido (Stripe +
              WhatsApp)
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <GarmentDetailModal
        product={inspectedState.product}
        initialSize={inspectedState.size}
        initialColor={inspectedState.color}
        onClose={() => setInspectedState({ product: null, size: "M" })}
        onAddToBag={handleAddToBag}
        onOpenSizeGuide={() => {
          setInspectedState({ product: null, size: "M" });
          setIsSizeGuideOpen(true);
        }}
      />

      <ShoppingBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        cep={cep}
        onCepChange={setCep}
        shippingQuote={shippingQuote}
        onApplyShippingQuote={setShippingQuote}
        checkoutMode={checkoutMode}
        onProceedToCheckout={(channel) => handleOpenCheckout(channel)}
      />

      <ModularCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={bagItems}
        checkoutMode={checkoutMode}
        onChangeCheckoutMode={handleModeChange}
        initialChannel={preferredCheckoutChannel}
        cep={cep}
        shippingQuote={shippingQuote}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={savedOrders}
        onClearHistory={handleClearOrderHistory}
      />
    </div>
  );
}
