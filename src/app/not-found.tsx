import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-galeria px-4 text-center text-ameixa">
      <div className="mx-auto max-w-md border border-ameixa/15 bg-pedra/60 p-8 sm:p-10 backdrop-blur-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-manteiga text-figo">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide uppercase text-figo">
          Erro 404 · Peça não encontrada
        </p>

        <h1 className="mt-2 font-serif text-3xl font-normal text-ameixa">
          Esta página não existe no atelier
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ameixa/75">
          O endereço solicitado foi alterado ou não está mais disponível.
          Retorne à página inicial para explorar a coleção autoral e nosso motor
          de checkout modular.
        </p>

        <div className="mt-7">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 bg-ameixa px-5 py-3 text-xs font-medium text-galeria transition-colors hover:bg-figo"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Retornar à coleção Casa Léa</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
