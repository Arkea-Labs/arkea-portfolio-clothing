# Casa Léa — Atelier Feminino (`arkea-portfolio-clothing`)

E-commerce de moda feminina contemporânea brasileira (`pt-BR`, `BRL R$`) desenvolvido com **Next.js App Router**, **TypeScript** e **Tailwind CSS**, pronto para deploy na Vercel.

## Destaques da Arquitetura

### 1. Motor de Pagamento Modular (3 Modos em Tempo Real)
Através da barra superior de demonstração (ou diretamente dentro do modal de checkout), o lojista ou visitante do portfólio pode alternar a arquitetura de pagamento da loja entre:
1. **Checkout Híbrido (Stripe + WhatsApp)**: A cliente escolhe se prefere pagar online automaticamente via **Stripe (Cartão em até 6x sem juros ou Pix com 10% de desconto)** ou **Finalizar pedido pelo WhatsApp com uma consultora**.
2. **Módulo Stripe Exclusivo**: Checkout transparente 100% online conectado à rota `/api/checkout/stripe` (suporta chaves reais `STRIPE_SECRET_KEY` ou simulação instantânea com geração de código Pix Copia e Cola e recibo de transação).
3. **Módulo WhatsApp Exclusivo**: Comércio conversacional que formata automaticamente os itens da sacola, códigos de referência (`LEA-014`), tamanhos (`PP`, `P`, `M`, `G`), cores, cálculo de frete por CEP e desconto Pix em uma mensagem estruturada (`#LEA-2048`) pronta para envio em `wa.me`.

### 2. Identidade Visual & Tipografia
- **Paleta de Cores**:
  - `Branco Galeria` (`#FAF9FB`) — fundo principal
  - `Pedra Lavada` (`#EFECE6`) — superfície editorial de peças e sacola lateral
  - `Ameixa Profundo` (`#2A1621`) — tipografia principal e ações primárias
  - `Vinho Figo` (`#6E2A44`) — estados ativos e destaques de pagamento
  - `Manteiga Suave` (`#F3E9D2`) — realce de desconto Pix 10% e barra de arquitetura
- **Tipografia**: `Cormorant Garamond` (títulos editoriais e nomes das peças) + `DM Sans` (seletores `PP P M G`, filtros e valores em `R$` com `tabular-nums`).

## Como Executar

```bash
npm.cmd install
npm.cmd run dev
```

Para validar o build de produção:

```bash
npm.cmd run build
```
