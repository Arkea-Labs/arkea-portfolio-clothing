"use client";

import React, { useState } from "react";
import { X, Ruler, CheckCircle2 } from "lucide-react";
import {
  GarmentSize,
  TABELA_MEDIDAS_FEMININA,
} from "@/data/catalog";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedSize?: (size: GarmentSize) => void;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  onSelectRecommendedSize,
}: SizeGuideModalProps) {
  const [busto, setBusto] = useState<number>(88);
  const [cintura, setCintura] = useState<number>(70);
  const [quadril, setQuadril] = useState<number>(96);

  if (!isOpen) return null;

  const calculateRecommendedSize = (): {
    size: GarmentSize;
    note: string;
  } => {
    if (busto <= 84 && cintura <= 66 && quadril <= 92) {
      return {
        size: "PP",
        note: "Caimento preciso para manequim 34–36 com leve folga de movimento.",
      };
    }
    if (busto <= 89 && cintura <= 71 && quadril <= 97) {
      return {
        size: "P",
        note: "Equilíbrio ideal para manequim 38 na linha de busto e quadril.",
      };
    }
    if (busto <= 95 && cintura <= 77 && quadril <= 103) {
      return {
        size: "M",
        note: "Proporção recomendada para manequim 40 com conforto nos ombros.",
      };
    }
    return {
      size: "G",
      note: "Caimento fluido pensado para manequim 42–44 sem tensionar o linho.",
    };
  };

  const recommendation = calculateRecommendedSize();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ameixa/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-tabela-medidas"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-ameixa/15 bg-galeria p-6 text-ameixa shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-ameixa/12 pb-5">
          <div>
            <p className="text-xs text-figo">Modelagem autoral Casa Léa</p>
            <h2
              id="titulo-tabela-medidas"
              className="mt-1 font-serif text-2xl font-normal sm:text-3xl"
            >
              Tabela de medidas feminina
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center border border-ameixa/15 text-ameixa/80 transition-colors hover:bg-pedra hover:text-ameixa"
            aria-label="Fechar tabela de medidas"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive Size Finder */}
        <div className="mt-6 bg-pedra p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ameixa">
            <Ruler className="h-4 w-4 text-figo" />
            <span>Simulador de caimento por medidas corporais</span>
          </div>
          <p className="mt-1 text-xs text-ameixa/75">
            Ajuste suas medidas em centímetros para identificar o tamanho mais
            adequado na alfaiataria e nos vestidos em linho Casa Léa.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-busto" className="font-medium">
                  Busto
                </label>
                <span className="tabular-nums font-semibold text-figo">
                  {busto} cm
                </span>
              </div>
              <input
                id="slider-busto"
                type="range"
                min={76}
                max={108}
                value={busto}
                onChange={(e) => setBusto(Number(e.target.value))}
                className="mt-2 w-full accent-figo"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-cintura" className="font-medium">
                  Cintura natural
                </label>
                <span className="tabular-nums font-semibold text-figo">
                  {cintura} cm
                </span>
              </div>
              <input
                id="slider-cintura"
                type="range"
                min={58}
                max={90}
                value={cintura}
                onChange={(e) => setCintura(Number(e.target.value))}
                className="mt-2 w-full accent-figo"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-quadril" className="font-medium">
                  Quadril
                </label>
                <span className="tabular-nums font-semibold text-figo">
                  {quadril} cm
                </span>
              </div>
              <input
                id="slider-quadril"
                type="range"
                min={84}
                max={116}
                value={quadril}
                onChange={(e) => setQuadril(Number(e.target.value))}
                className="mt-2 w-full accent-figo"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-ameixa/10 pt-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-figo" />
              <div>
                <p className="text-sm font-medium text-ameixa">
                  Tamanho sugerido:{" "}
                  <span className="inline-block bg-manteiga px-2 py-0.5 font-semibold text-ameixa">
                    {recommendation.size}
                  </span>
                </p>
                <p className="text-xs text-ameixa/75">{recommendation.note}</p>
              </div>
            </div>
            {onSelectRecommendedSize && (
              <button
                type="button"
                onClick={() => {
                  onSelectRecommendedSize(recommendation.size);
                  onClose();
                }}
                className="shrink-0 bg-ameixa px-4 py-2 text-xs font-medium text-galeria transition-colors hover:bg-figo"
              >
                Aplicar tamanho {recommendation.size}
              </button>
            )}
          </div>
        </div>

        {/* Standard Size Chart Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ameixa/15 text-xs text-ameixa/70">
                <th className="py-3 pr-4 font-medium">Tamanho</th>
                <th className="px-4 py-3 font-medium">Manequim BR</th>
                <th className="px-4 py-3 font-medium">Busto (cm)</th>
                <th className="px-4 py-3 font-medium">Cintura (cm)</th>
                <th className="px-4 py-3 font-medium">Quadril (cm)</th>
                <th className="pl-4 py-3 font-medium">Ombro a ombro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ameixa/10 tabular-nums">
              {TABELA_MEDIDAS_FEMININA.map((row) => {
                const isSuggested = row.size === recommendation.size;
                return (
                  <tr
                    key={row.size}
                    className={
                      isSuggested ? "bg-manteiga/55 font-medium" : "bg-transparent"
                    }
                  >
                    <td className="py-3 pr-4 font-semibold text-ameixa">
                      {row.size}
                      {isSuggested && (
                        <span className="ml-2 bg-figo px-1.5 py-0.5 text-[10px] font-normal text-galeria">
                          Ideal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ameixa/80">{row.maneBraz}</td>
                    <td className="px-4 py-3">
                      {row.bustoCm[0]} – {row.bustoCm[1]} cm
                    </td>
                    <td className="px-4 py-3">
                      {row.cinturaCm[0]} – {row.cinturaCm[1]} cm
                    </td>
                    <td className="px-4 py-3">
                      {row.quadrilCm[0]} – {row.quadrilCm[1]} cm
                    </td>
                    <td className="pl-4 py-3 text-ameixa/80">{row.ombroCm}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-ameixa/12 pt-5 text-xs text-ameixa/75 sm:grid-cols-2">
          <div>
            <p className="font-medium text-ameixa">Ajuste de bainha cortesia</p>
            <p className="mt-1">
              Todas as calças pantalonas e vestidos longos contam com ajuste de
              comprimento cortesia em nosso atelier nos Jardins ou mediante
              medida informada no checkout.
            </p>
          </div>
          <div>
            <p className="font-medium text-ameixa">Primeira troca sem custo</p>
            <p className="mt-1">
              Caso deseje trocar o tamanho após experimentar em casa, a coleta
              reversa ocorre em até 30 dias corridos sem custo adicional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
