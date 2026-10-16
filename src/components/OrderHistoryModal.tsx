"use client";

import React from "react";
import { X, Receipt, CreditCard, MessageCircle, Trash2 } from "lucide-react";
import { formatBRL } from "@/data/catalog";
import { SavedOrderRecord } from "./ModularCheckoutModal";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: SavedOrderRecord[];
  onClearHistory: () => void;
}

export function OrderHistoryModal({
  isOpen,
  onClose,
  orders,
  onClearHistory,
}: OrderHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ameixa/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="historico-pedidos-titulo"
    >
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto border border-ameixa/15 bg-galeria p-6 text-ameixa shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-ameixa/12 pb-4">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-5 w-5 text-figo" />
            <div>
              <p className="text-xs text-figo">Persistência em localStorage</p>
              <h2
                id="historico-pedidos-titulo"
                className="font-serif text-2xl font-normal text-ameixa"
              >
                Histórico de pedidos realizados
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center border border-ameixa/15 text-ameixa/75 hover:bg-pedra"
            aria-label="Fechar histórico"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-xl text-ameixa">
              Nenhum pedido registrado ainda
            </p>
            <p className="mt-1.5 text-xs text-ameixa/70">
              Experimente finalizar uma compra pelo Módulo Stripe ou pelo Módulo
              WhatsApp para visualizar o registro aqui.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {orders.map((order, idx) => (
              <div
                key={`${order.orderNumber}-${idx}`}
                className="border border-ameixa/12 bg-pedra p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ameixa/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-semibold text-ameixa">
                      {order.orderNumber}
                    </span>
                    <span className="bg-manteiga px-2 py-0.5 text-[11px] font-medium text-ameixa">
                      {order.channel === "whatsapp_concierge" ? (
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-figo" />
                          WhatsApp Concierge
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-figo" />
                          {order.channel === "stripe_pix"
                            ? "Stripe Pix (-10%)"
                            : `Stripe Cartão (${order.installments}x)`}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-ameixa/65">
                    {order.createdAt}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-ameixa/85">
                  {order.itemsSummary.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name} ({item.size} · {item.color})
                      </span>
                      <span className="tabular-nums font-medium">
                        {formatBRL(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ameixa/10 pt-2.5 text-xs">
                  <span className="text-ameixa/70">
                    Cliente: {order.customerName} · CEP {order.cep}
                  </span>
                  <span className="font-semibold tabular-nums text-figo">
                    Total: {formatBRL(order.total)}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 text-xs text-ameixa/65 hover:text-figo"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Limpar histórico de demonstração
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
