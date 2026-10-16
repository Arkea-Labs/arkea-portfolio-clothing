"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Sparkles,
  QrCode,
  ExternalLink,
  Layers,
} from "lucide-react";
import {
  CheckoutArchitectureMode,
  formatBRL,
  FRETE_GRATIS_MINIMO,
  MAX_INSTALLMENTS,
  PIX_DISCOUNT_RATE,
  ShippingQuote,
  WHATSAPP_CONSULTANT_PHONE,
} from "@/data/catalog";
import { BagItem } from "./ShoppingBagDrawer";

export interface SavedOrderRecord {
  orderNumber: string;
  channel: "stripe_card" | "stripe_pix" | "whatsapp_concierge";
  architectureModeAtPurchase: CheckoutArchitectureMode;
  createdAt: string;
  customerName: string;
  cep: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  installments: number;
  stripeSessionId?: string;
  whatsappPreviewText?: string;
  itemsSummary: Array<{
    name: string;
    code: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface ModularCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  checkoutMode: CheckoutArchitectureMode;
  onChangeCheckoutMode: (mode: CheckoutArchitectureMode) => void;
  initialChannel?: "stripe" | "whatsapp";
  cep: string;
  shippingQuote: ShippingQuote | null;
  onOrderCompleted: (order: SavedOrderRecord) => void;
}

export function ModularCheckoutModal({
  isOpen,
  onClose,
  items,
  checkoutMode,
  onChangeCheckoutMode,
  initialChannel = "stripe",
  cep,
  shippingQuote,
  onOrderCompleted,
}: ModularCheckoutModalProps) {
  const [activeChannel, setActiveChannel] = useState<"stripe" | "whatsapp">(
    initialChannel
  );
  const [stripeMethod, setStripeMethod] = useState<"card" | "pix">("card");
  const [installments, setInstallments] = useState<number>(3);

  // Customer info pre-populated with realistic São Paulo boutique data for effortless testing
  const [customerName, setCustomerName] = useState("Helena Vasconcelos");
  const [customerEmail, setCustomerEmail] = useState(
    "helena.vasconcelos@exemplo.com.br"
  );
  const [customerCpf, setCustomerCpf] = useState("348.912.608-42");
  const [customerPhone, setCustomerPhone] = useState("(11) 99412-8830");
  const [customerAddress, setCustomerAddress] = useState(
    "Rua Oscar Freire, 1140 · Apto 62 · Jardins, São Paulo - SP"
  );

  // Simulated card fields for Stripe UI
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8841");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvc, setCardCvc] = useState("842");

  // WhatsApp preference
  const [whatsappPaymentPref, setWhatsappPaymentPref] = useState<
    "pix" | "link_cartao" | "atelier_pickup"
  >("pix");
  const [customTailoringNote, setCustomTailoringNote] = useState(
    "Gostaria de verificar a possibilidade de bainha para 1,68m de altura."
  );

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<SavedOrderRecord | null>(
    null
  );
  const [pixCopiaCola, setPixCopiaCola] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Keep activeChannel synced with checkoutMode
  useEffect(() => {
    if (checkoutMode === "stripe") {
      setActiveChannel("stripe");
    } else if (checkoutMode === "whatsapp") {
      setActiveChannel("whatsapp");
    } else if (initialChannel) {
      setActiveChannel(initialChannel);
    }
  }, [checkoutMode, initialChannel, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
      setPixCopiaCola(null);
      setCopiedText(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const effectiveShippingCost =
    subtotal >= FRETE_GRATIS_MINIMO
      ? 0
      : shippingQuote
        ? shippingQuote.cost
        : 0;

  const isPixDiscountApplied =
    (activeChannel === "stripe" && stripeMethod === "pix") ||
    (activeChannel === "whatsapp" && whatsappPaymentPref === "pix");

  const discountAmount = isPixDiscountApplied
    ? Number((subtotal * PIX_DISCOUNT_RATE).toFixed(2))
    : 0;

  const finalTotal = Number(
    (subtotal - discountAmount + effectiveShippingCost).toFixed(2)
  );

  const previewOrderCode = completedOrder?.orderNumber || "#LEA-2048";

  // Build formatted WhatsApp order message
  const buildWhatsAppMessage = (orderCode: string) => {
    const lines = [
      `Olá, Atelier Casa Léa! Gostaria de finalizar meu pedido *${orderCode}*:`,
      "",
      "*Peças selecionadas:*",
      ...items.map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (${item.product.code}) | Tam: *${item.size}* | Cor: *${item.color.name}* — ${formatBRL(
            item.product.price * item.quantity
          )}`
      ),
      "",
      `*Subtotal:* ${formatBRL(subtotal)}`,
      ...(discountAmount > 0
        ? [`*Desconto Pix (10%):* -${formatBRL(discountAmount)}`]
        : []),
      `*Entrega (${cep || "01414-001"}):* ${
        effectiveShippingCost === 0
          ? "Cortesia Casa Léa (Grátis)"
          : formatBRL(effectiveShippingCost)
      }`,
      `*Total do Pedido:* *${formatBRL(finalTotal)}*`,
      "",
      "*Dados para envio:*",
      `Nome: ${customerName}`,
      `Endereço: ${customerAddress}`,
      `Preferência de pagamento: ${
        whatsappPaymentPref === "pix"
          ? "Chave Pix com 10% de desconto"
          : whatsappPaymentPref === "link_cartao"
            ? "Link de pagamento Cartão em até 6x sem juros"
            : "Retirada e pagamento no Atelier Jardins"
      }`,
      ...(customTailoringNote.trim()
        ? [`Observação de atelier: ${customTailoringNote.trim()}`]
        : []),
    ];
    return lines.join("\n");
  };

  const whatsappMessagePreview = buildWhatsAppMessage(previewOrderCode);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONSULTANT_PHONE}?text=${encodeURIComponent(
    whatsappMessagePreview
  )}`;

  const handleStripeCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            code: item.product.code,
            size: item.size,
            colorName: item.color.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
          })),
          paymentMethod: stripeMethod,
          installments: stripeMethod === "card" ? installments : 1,
          shippingCost: effectiveShippingCost,
          cep: cep || "01414-001",
          customer: {
            name: customerName,
            email: customerEmail,
            cpf: customerCpf,
            phone: customerPhone,
            addressLine: customerAddress,
          },
        }),
      });

      const data = await response.json();

      const newOrder: SavedOrderRecord = {
        orderNumber: data.orderNumber || "#LEA-2048",
        channel: stripeMethod === "pix" ? "stripe_pix" : "stripe_card",
        architectureModeAtPurchase: checkoutMode,
        createdAt: new Date().toLocaleString("pt-BR"),
        customerName,
        cep: cep || "01414-001",
        subtotal,
        discount: discountAmount,
        shippingCost: effectiveShippingCost,
        total: finalTotal,
        installments: stripeMethod === "card" ? installments : 1,
        stripeSessionId: data.sessionId || "cs_test_casalea_2048",
        itemsSummary: items.map((item) => ({
          name: item.product.name,
          code: item.product.code,
          size: item.size,
          color: item.color.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      };

      if (data.pixCopiaECola) {
        setPixCopiaCola(data.pixCopiaECola);
      }

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppCheckoutConfirm = (openExternalWa: boolean) => {
    const orderNumber = "#LEA-2048";
    const finalMessage = buildWhatsAppMessage(orderNumber);

    const newOrder: SavedOrderRecord = {
      orderNumber,
      channel: "whatsapp_concierge",
      architectureModeAtPurchase: checkoutMode,
      createdAt: new Date().toLocaleString("pt-BR"),
      customerName,
      cep: cep || "01414-001",
      subtotal,
      discount: discountAmount,
      shippingCost: effectiveShippingCost,
      total: finalTotal,
      installments: whatsappPaymentPref === "link_cartao" ? 6 : 1,
      whatsappPreviewText: finalMessage,
      itemsSummary: items.map((item) => ({
        name: item.product.name,
        code: item.product.code,
        size: item.size,
        color: item.color.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);

    if (openExternalWa && typeof window !== "undefined") {
      window.open(
        `https://wa.me/${WHATSAPP_CONSULTANT_PHONE}?text=${encodeURIComponent(
          finalMessage
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleCopyText = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ameixa/60 p-3 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-titulo"
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto border border-ameixa/20 bg-galeria text-ameixa shadow-2xl">
        {/* Top Architecture Bar inside Modal */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ameixa/12 bg-manteiga px-5 py-3 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-figo" />
            <span className="font-medium text-ameixa">
              Módulo de Pagamento Ativo:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  id: "hybrid",
                  label: "1. Híbrido (Stripe + WhatsApp)",
                },
                {
                  id: "stripe",
                  label: "2. Stripe Exclusivo",
                },
                {
                  id: "whatsapp",
                  label: "3. WhatsApp Exclusivo",
                },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeCheckoutMode(m.id)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  checkoutMode === m.id
                    ? "bg-figo text-galeria"
                    : "bg-galeria/80 text-ameixa hover:bg-galeria"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center border border-ameixa/20 bg-galeria text-ameixa hover:bg-pedra"
            aria-label="Fechar checkout"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Main Content */}
        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-2xl border border-ameixa/15 bg-pedra p-6 sm:p-8">
              <div className="flex items-center gap-3 text-figo">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-xs font-medium">
                  Pedido registrado com sucesso no atelier
                </span>
              </div>

              <h2
                id="checkout-modal-titulo"
                className="mt-2 font-serif text-3xl font-normal text-ameixa"
              >
                Pedido {completedOrder.orderNumber} confirmado
              </h2>

              <p className="mt-2 text-sm text-ameixa/80">
                Obrigada, <strong>{completedOrder.customerName}</strong>. Suas
                peças estão sendo preparadas em papel de seda livre de ácido com
                a fragrância botânica Casa Léa.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 border-y border-ameixa/12 py-4 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-ameixa/65">Canal de conclusão</span>
                  <p className="mt-0.5 font-semibold text-ameixa">
                    {completedOrder.channel === "stripe_card" &&
                      `Stripe Cartão (${completedOrder.installments}x sem juros)`}
                    {completedOrder.channel === "stripe_pix" &&
                      "Stripe Pix Instantâneo (-10%)"}
                    {completedOrder.channel === "whatsapp_concierge" &&
                      "WhatsApp Concierge Casa Léa"}
                  </p>
                </div>
                <div>
                  <span className="text-ameixa/65">Total processado</span>
                  <p className="mt-0.5 font-semibold tabular-nums text-figo">
                    {formatBRL(completedOrder.total)}
                  </p>
                </div>
                <div>
                  <span className="text-ameixa/65">Identificador técnico</span>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-ameixa/85">
                    {completedOrder.stripeSessionId ||
                      `wa_concierge_${completedOrder.orderNumber}`}
                  </p>
                </div>
              </div>

              {/* If Pix via Stripe, show QR & Copia e Cola */}
              {completedOrder.channel === "stripe_pix" && pixCopiaCola && (
                <div className="mt-5 border border-ameixa/15 bg-galeria p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ameixa">
                    <QrCode className="h-4 w-4 text-figo" />
                    <span>Código Pix Copia e Cola gerado via Stripe</span>
                  </div>
                  <p className="mt-1 break-all bg-pedra p-2.5 font-mono text-[11px] text-ameixa/80">
                    {pixCopiaCola}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyText(pixCopiaCola)}
                    className="mt-2.5 inline-flex items-center gap-1.5 bg-ameixa px-3.5 py-1.5 text-xs font-medium text-galeria hover:bg-figo"
                  >
                    {copiedText ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Código Pix copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar código Pix
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* If WhatsApp Concierge, show the sent message */}
              {completedOrder.channel === "whatsapp_concierge" &&
                completedOrder.whatsappPreviewText && (
                  <div className="mt-5 border border-ameixa/15 bg-galeria p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ameixa">
                        Mensagem formatada enviada para a consultora
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            completedOrder.whatsappPreviewText || ""
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-figo hover:underline"
                      >
                        {copiedText ? "Copiado!" : "Copiar mensagem"}
                      </button>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap bg-pedra p-3 font-sans text-xs leading-relaxed text-ameixa/85">
                      {completedOrder.whatsappPreviewText}
                    </pre>
                  </div>
                )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-ameixa/70">
                  Pedido salvo no histórico local do navegador (localStorage).
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-ameixa px-6 py-2.5 text-xs font-medium text-galeria transition-colors hover:bg-figo"
                >
                  Voltar para a galeria Casa Léa
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 Columns: Checkout Form & Active Payment Engine */}
            <div className="p-6 sm:p-8 lg:col-span-7">
              <div className="border-b border-ameixa/12 pb-4">
                <p className="text-xs text-figo">
                  {checkoutMode === "hybrid" &&
                    "Arquitetura Híbrida · A cliente escolhe entre Stripe ou WhatsApp"}
                  {checkoutMode === "stripe" &&
                    "Módulo Stripe Exclusivo · Checkout transparente 100% online"}
                  {checkoutMode === "whatsapp" &&
                    "Módulo WhatsApp Exclusivo · Comércio conversacional assistido"}
                </p>
                <h2
                  id="checkout-modal-titulo"
                  className="mt-1 font-serif text-2xl font-normal text-ameixa sm:text-3xl"
                >
                  Finalização de pedido Casa Léa
                </h2>
              </div>

              {/* Channel Selector when in Hybrid Mode */}
              {checkoutMode === "hybrid" && (
                <div className="mt-5">
                  <span className="text-xs font-medium text-ameixa/80">
                    Como prefere concluir sua compra hoje?
                  </span>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveChannel("stripe")}
                      className={`flex flex-col items-start border p-3.5 text-left transition-all ${
                        activeChannel === "stripe"
                          ? "border-figo bg-pedra ring-1 ring-figo"
                          : "border-ameixa/15 bg-galeria hover:bg-pedra/50"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ameixa">
                          <CreditCard className="h-3.5 w-3.5 text-figo" />
                          Pagamento Online (Stripe)
                        </span>
                        {activeChannel === "stripe" && (
                          <span className="bg-figo px-1.5 py-0.5 text-[10px] text-galeria">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-ameixa/75">
                        Cartão em até 6x sem juros ou Pix imediato com 10% de
                        desconto.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveChannel("whatsapp")}
                      className={`flex flex-col items-start border p-3.5 text-left transition-all ${
                        activeChannel === "whatsapp"
                          ? "border-figo bg-pedra ring-1 ring-figo"
                          : "border-ameixa/15 bg-galeria hover:bg-pedra/50"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ameixa">
                          <MessageCircle className="h-3.5 w-3.5 text-figo" />
                          Consultora via WhatsApp
                        </span>
                        {activeChannel === "whatsapp" && (
                          <span className="bg-figo px-1.5 py-0.5 text-[10px] text-galeria">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-ameixa/75">
                        Envie a sacola pronta com tamanhos e cores para uma
                        consultora do atelier.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Identification Fields */}
              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ameixa">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full border border-ameixa/20 bg-pedra/35 px-3 py-2 text-xs text-ameixa focus:border-figo focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ameixa">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 w-full border border-ameixa/20 bg-pedra/35 px-3 py-2 text-xs tabular-nums text-ameixa focus:border-figo focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-ameixa">
                    Endereço de entrega ({cep || "01414-001"})
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="mt-1 w-full border border-ameixa/20 bg-pedra/35 px-3 py-2 text-xs text-ameixa focus:border-figo focus:outline-none"
                  />
                </div>
              </div>

              {/* ENGINE A: STRIPE ONLINE CHECKOUT */}
              {activeChannel === "stripe" && (
                <form onSubmit={handleStripeCheckoutSubmit} className="mt-6">
                  <div className="border border-ameixa/15 bg-pedra p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ameixa">
                        <Lock className="h-3.5 w-3.5 text-figo" />
                        Stripe Payment Sheet · Ambiente Seguro BRL
                      </span>
                      <span className="text-[11px] text-ameixa/65">
                        API Route: /api/checkout/stripe
                      </span>
                    </div>

                    {/* Method Switcher: Cartão vs Pix */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStripeMethod("card")}
                        className={`py-2.5 text-xs font-medium transition-colors ${
                          stripeMethod === "card"
                            ? "bg-ameixa text-galeria"
                            : "border border-ameixa/15 bg-galeria text-ameixa"
                        }`}
                      >
                        Cartão até 6x sem juros
                      </button>
                      <button
                        type="button"
                        onClick={() => setStripeMethod("pix")}
                        className={`py-2.5 text-xs font-medium transition-colors ${
                          stripeMethod === "pix"
                            ? "bg-figo text-galeria"
                            : "border border-ameixa/15 bg-manteiga text-ameixa"
                        }`}
                      >
                        Pix Instantâneo (-10%)
                      </button>
                    </div>

                    {stripeMethod === "card" ? (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] text-ameixa/75">
                              E-mail para recibo Stripe
                            </label>
                            <input
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs text-ameixa"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-ameixa/75">
                              CPF na Nota Fiscal Paulista
                            </label>
                            <input
                              type="text"
                              value={customerCpf}
                              onChange={(e) => setCustomerCpf(e.target.value)}
                              className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs tabular-nums text-ameixa"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-6">
                            <label className="block text-[11px] text-ameixa/75">
                              Número do cartão
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs tabular-nums text-ameixa"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] text-ameixa/75">
                              Validade
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs tabular-nums text-ameixa"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] text-ameixa/75">
                              CVC
                            </label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs tabular-nums text-ameixa"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-ameixa/75">
                            Parcelamento sem juros Casa Léa
                          </label>
                          <select
                            value={installments}
                            onChange={(e) =>
                              setInstallments(Number(e.target.value))
                            }
                            className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs tabular-nums text-ameixa"
                          >
                            {Array.from(
                              { length: MAX_INSTALLMENTS },
                              (_, i) => i + 1
                            ).map((n) => (
                              <option key={n} value={n}>
                                {n}x de {formatBRL(finalTotal / n)} sem juros (Total{" "}
                                {formatBRL(finalTotal)})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 border border-ameixa/12 bg-manteiga p-3.5 text-xs text-ameixa">
                        <div className="flex items-center gap-2 font-semibold text-figo">
                          <Sparkles className="h-4 w-4" />
                          <span>
                            10% de desconto aplicado automaticamente no Pix (
                            -{formatBRL(discountAmount)})
                          </span>
                        </div>
                        <p className="mt-1 text-ameixa/80">
                          Ao confirmar, o endpoint{" "}
                          <code className="font-mono">/api/checkout/stripe</code>{" "}
                          gera o código Pix Copia e Cola e libera a separação
                          imediata da sua peça no atelier.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="mt-5 w-full bg-ameixa py-3.5 text-xs font-medium text-galeria transition-colors hover:bg-figo disabled:opacity-50"
                    >
                      {isProcessing
                        ? "Processando transação na Stripe..."
                        : stripeMethod === "pix"
                          ? `Gerar Pix com 10% de desconto · ${formatBRL(finalTotal)}`
                          : `Confirmar pagamento em ${installments}x de ${formatBRL(
                              finalTotal / installments
                            )}`}
                    </button>
                  </div>
                </form>
              )}

              {/* ENGINE B: WHATSAPP CONVERSATIONAL CHECKOUT */}
              {activeChannel === "whatsapp" && (
                <div className="mt-6 border border-ameixa/15 bg-pedra p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ameixa">
                      <MessageCircle className="h-3.5 w-3.5 text-figo" />
                      Módulo WhatsApp Concierge · Pedido {previewOrderCode}
                    </span>
                    <span className="bg-manteiga px-2 py-0.5 text-[11px] font-medium text-ameixa">
                      Atendimento humano
                    </span>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[11px] font-medium text-ameixa/80">
                      Como deseja pagar ao falar com a consultora?
                    </label>
                    <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setWhatsappPaymentPref("pix")}
                        className={`px-3 py-2 text-left text-xs transition-colors ${
                          whatsappPaymentPref === "pix"
                            ? "bg-figo text-galeria"
                            : "border border-ameixa/15 bg-galeria text-ameixa"
                        }`}
                      >
                        Pix com 10% OFF
                      </button>
                      <button
                        type="button"
                        onClick={() => setWhatsappPaymentPref("link_cartao")}
                        className={`px-3 py-2 text-left text-xs transition-colors ${
                          whatsappPaymentPref === "link_cartao"
                            ? "bg-figo text-galeria"
                            : "border border-ameixa/15 bg-galeria text-ameixa"
                        }`}
                      >
                        Link Cartão até 6x
                      </button>
                      <button
                        type="button"
                        onClick={() => setWhatsappPaymentPref("atelier_pickup")}
                        className={`px-3 py-2 text-left text-xs transition-colors ${
                          whatsappPaymentPref === "atelier_pickup"
                            ? "bg-figo text-galeria"
                            : "border border-ameixa/15 bg-galeria text-ameixa"
                        }`}
                      >
                        Retirada no Atelier
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[11px] font-medium text-ameixa/80">
                      Nota de ajuste ou medidas para a costureira (opcional)
                    </label>
                    <input
                      type="text"
                      value={customTailoringNote}
                      onChange={(e) => setCustomTailoringNote(e.target.value)}
                      className="mt-1 w-full border border-ameixa/20 bg-galeria px-3 py-2 text-xs text-ameixa"
                    />
                  </div>

                  {/* Interactive WhatsApp Message Preview */}
                  <div className="mt-4 border border-ameixa/15 bg-galeria p-3.5">
                    <div className="flex items-center justify-between border-b border-ameixa/10 pb-2">
                      <span className="text-[11px] font-semibold text-ameixa">
                        Pré-visualização da mensagem estruturada (wa.me)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(whatsappMessagePreview)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-figo hover:underline"
                      >
                        {copiedText ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copiar texto
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="mt-2.5 max-h-44 overflow-y-auto whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-ameixa/85">
                      {whatsappMessagePreview}
                    </pre>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppCheckoutConfirm(true)}
                      className="flex flex-1 items-center justify-center gap-2 bg-figo py-3 text-xs font-medium text-galeria transition-colors hover:bg-ameixa"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Enviar pedido no WhatsApp ({previewOrderCode})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppCheckoutConfirm(false)}
                      className="border border-ameixa/25 bg-galeria px-4 py-3 text-xs font-medium text-ameixa transition-colors hover:bg-manteiga"
                    >
                      Simular envio no navegador
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-ameixa/65">
                    Link direto gerado:{" "}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-figo"
                    >
                      wa.me/{WHATSAPP_CONSULTANT_PHONE}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Order Summary Dossier */}
            <div className="border-t border-ameixa/12 bg-pedra p-6 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
              <h3 className="font-serif text-xl font-normal text-ameixa">
                Resumo da curadoria ({items.reduce((a, b) => a + b.quantity, 0)}{" "}
                {items.reduce((a, b) => a + b.quantity, 0) === 1
                  ? "peça"
                  : "peças"}
                )
              </h3>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 border-b border-ameixa/10 pb-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-11 shrink-0 overflow-hidden bg-galeria">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.color.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-ameixa">
                          {item.quantity}x {item.product.name}
                        </p>
                        <p className="text-[11px] text-ameixa/70">
                          Tam. {item.size} · {item.color.name} ({item.product.code})
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-semibold tabular-nums text-ameixa">
                      {formatBRL(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-ameixa/15 pt-4 text-xs">
                <div className="flex justify-between text-ameixa/80">
                  <span>Subtotal das peças</span>
                  <span className="tabular-nums">{formatBRL(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between bg-manteiga px-2 py-1 font-medium text-figo">
                    <span>Desconto Pix (10%)</span>
                    <span className="tabular-nums">
                      -{formatBRL(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-ameixa/80">
                  <span>Entrega ({cep || "01414-001"})</span>
                  <span className="tabular-nums">
                    {effectiveShippingCost === 0
                      ? "Cortesia (Grátis)"
                      : formatBRL(effectiveShippingCost)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-ameixa/15 pt-3 text-base font-semibold text-ameixa">
                  <span>Total a pagar</span>
                  <span className="tabular-nums text-lg text-figo">
                    {formatBRL(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Architectural Proof Box for Portfolio Evaluators */}
              <div className="mt-6 border border-ameixa/15 bg-galeria p-4 text-[11px] leading-relaxed text-ameixa/80">
                <p className="font-semibold text-ameixa">
                  Nota de Arquitetura Modular (Showcase)
                </p>
                <p className="mt-1">
                  Esta loja demonstra um motor de checkout desacoplado. A marca
                  pode operar apenas com pagamento autônomo (Stripe), apenas via
                  consultoria no WhatsApp, ou em modo híbrido maximizando a
                  conversão de peças de ticket alto.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
