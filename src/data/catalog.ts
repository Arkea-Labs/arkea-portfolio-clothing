export type CategoryFilter =
  | "Todas as peças"
  | "Vestidos"
  | "Alfaiataria"
  | "Blusas & Seda"
  | "Acessórios";

export type GarmentSize = "PP" | "P" | "M" | "G";

export type CheckoutArchitectureMode = "hybrid" | "stripe" | "whatsapp";

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  weaveAccentHex: string;
  imageUrl: string;
  detailImageUrl: string;
}

export interface GarmentProduct {
  id: string;
  code: string;
  name: string;
  category: Exclude<CategoryFilter, "Todas as peças">;
  price: number;
  fabric: string;
  gramatura: string;
  origin: string;
  editorialLead: string;
  description: string;
  fitNotes: string;
  care: string[];
  sizes: GarmentSize[];
  colors: ColorVariant[];
  isEditorialHighlight?: boolean;
}

export interface SizeMeasurementRow {
  size: GarmentSize;
  maneBraz: string;
  bustoCm: [number, number];
  cinturaCm: [number, number];
  quadrilCm: [number, number];
  ombroCm: string;
}

export interface ShippingQuote {
  cep: string;
  regionName: string;
  carrier: string;
  days: string;
  cost: number;
  isFreeByThreshold: boolean;
}

export const FRETE_GRATIS_MINIMO = 450;
export const PIX_DISCOUNT_RATE = 0.1; // 10% de desconto no Pix
export const MAX_INSTALLMENTS = 6; // Até 6x sem juros no Stripe

export const WHATSAPP_CONSULTANT_PHONE = "5511998241920";

export const TABELA_MEDIDAS_FEMININA: SizeMeasurementRow[] = [
  {
    size: "PP",
    maneBraz: "34 – 36",
    bustoCm: [80, 84],
    cinturaCm: [62, 66],
    quadrilCm: [88, 92],
    ombroCm: "36,5 cm",
  },
  {
    size: "P",
    maneBraz: "38",
    bustoCm: [85, 89],
    cinturaCm: [67, 71],
    quadrilCm: [93, 97],
    ombroCm: "38,0 cm",
  },
  {
    size: "M",
    maneBraz: "40",
    bustoCm: [90, 95],
    cinturaCm: [72, 77],
    quadrilCm: [98, 103],
    ombroCm: "39,5 cm",
  },
  {
    size: "G",
    maneBraz: "42 – 44",
    bustoCm: [96, 102],
    cinturaCm: [78, 84],
    quadrilCm: [104, 110],
    ombroCm: "41,0 cm",
  },
];

export const CATALOG_PRODUCTS: GarmentProduct[] = [
  {
    id: "vestido-midi-celina",
    code: "LEA-014",
    name: "Vestido Midi Linho Puro Celina",
    category: "Vestidos",
    price: 489.0,
    fabric: "100% Linho Belga Certificado",
    gramatura: "185 g/m² · Pré-lavado em água termal",
    origin: "Atelier Casa Léa · Jardins, São Paulo",
    editorialLead:
      "Corte enviesado na cintura com caimento coluna e fenda lateral silenciosa.",
    description:
      "Construído em linho puro de fibra longa que amacia a cada uso. Possui decote reto arquitetônico, alças largas com regulagem interna invisível e forro em cambraia de algodão respirável.",
    fitNotes:
      "Modelagem levemente acinturada com quadril fluido. Recomendamos seu tamanho habitual.",
    care: [
      "Lavagem manual a frio com sabão neutro líquido",
      "Secar à sombra em superfície plana",
      "Passar com vapor ainda levemente úmido",
    ],
    sizes: ["PP", "P", "M", "G"],
    isEditorialHighlight: true,
    colors: [
      {
        id: "cru-aveia",
        name: "Cru Aveia",
        hex: "#E6DEC8",
        weaveAccentHex: "#C9BEA3",
        imageUrl:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "ameixa-noturno",
        name: "Ameixa Noturno",
        hex: "#3A1C29",
        weaveAccentHex: "#6E2A44",
        imageUrl:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "salvia-mineral",
        name: "Sálvia Mineral",
        hex: "#9CA89A",
        weaveAccentHex: "#7A8778",
        imageUrl:
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "blazer-alfaiataria-valentina",
    code: "LEA-021",
    name: "Blazer Alfaiataria Linho Valentina",
    category: "Alfaiataria",
    price: 629.0,
    fabric: "78% Linho Europeu, 22% Seda Rústica",
    gramatura: "240 g/m² · Entretela leve de algodão",
    origin: "Alfaiataria própria · São Paulo",
    editorialLead:
      "Ombros desenhados com precisão e lapela alongada que acompanha o movimento do corpo.",
    description:
      "Peça-chave da alfaiataria Casa Léa. O encontro do linho pesado com fios de seda rústica confere estrutura sem rigidez. Abotoamento simples em madrepérola natural escurecida e bolsos embutidos.",
    fitNotes:
      "Modelagem reta e levemente alongada abaixo do quadril. Ideal para sobreposição.",
    care: [
      "Limpeza profissional a seco recomendada",
      "Guardar em cabide anatômico de madeira",
      "Vaporizar verticalmente para preservar a lapela",
    ],
    sizes: ["PP", "P", "M", "G"],
    isEditorialHighlight: true,
    colors: [
      {
        id: "pedra-calcario",
        name: "Pedra Calcário",
        hex: "#DDD7CD",
        weaveAccentHex: "#B8B0A2",
        imageUrl:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "figo-profundo",
        name: "Figo Profundo",
        hex: "#582137",
        weaveAccentHex: "#2A1621",
        imageUrl:
          "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "blusa-seda-lumiere",
    code: "LEA-033",
    name: "Blusa Seda Acetinada Lumière",
    category: "Blusas & Seda",
    price: 279.9,
    fabric: "100% Seda Mulberry 19 Momme",
    gramatura: "82 g/m² · Toque acetinado natural",
    origin: "Seda fiação brasileira · Vale do Paraíba",
    editorialLead:
      "Gola degagé suave que reflete a luz natural com brilho contido de galeria.",
    description:
      "Tecida em seda pura 19 momme de origem rastreável. O corte em viés permite que a peça deslize sobre a pele com frescor térmico incomparável, transitando da reunião diurna ao jantar.",
    fitNotes:
      "Caimento fluido em viés que abraça suavemente a silhueta sem marcar.",
    care: [
      "Lavagem delicada à mão em água fria",
      "Não torcer; absorver umidade em toalha branca",
      "Vaporizar pelo avesso em temperatura mínima",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "perola-manteiga",
        name: "Pérola Manteiga",
        hex: "#F1E6CE",
        weaveAccentHex: "#D8C8A8",
        imageUrl:
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "vinho-figo",
        name: "Vinho Figo",
        hex: "#6E2A44",
        weaveAccentHex: "#47192B",
        imageUrl:
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "calca-pantalona-helena",
    code: "LEA-042",
    name: "Calça Pantalona Fluida Helena",
    category: "Alfaiataria",
    price: 379.0,
    fabric: "65% Linho Puro, 35% Viscose EcoVero",
    gramatura: "205 g/m² · Pregas duplas frontais",
    origin: "Atelier Casa Léa · Jardins, São Paulo",
    editorialLead:
      "Cintura alta com pregas profundas que alongam a linha vertical ao caminhar.",
    description:
      "Nossa pantalona assinatura une a textura nobre do linho ao balanço líquido da fibra botânica certificada. Possui cós estruturado com colchete interno de alfaiataria e bolsos faca profundos.",
    fitNotes:
      "Cintura alta anatômica e pernas amplas. Comprimento pensado para sandálias de salto bloco ou rasteiras.",
    care: [
      "Lavagem em ciclo delicado a frio",
      "Secar pendurada pelo cós",
      "Passar com ferro a vapor em temperatura média",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "areia-galeria",
        name: "Areia Galeria",
        hex: "#E5DFD5",
        weaveAccentHex: "#C5BCAE",
        imageUrl:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "ameixa-escuro",
        name: "Ameixa Profundo",
        hex: "#2A1621",
        weaveAccentHex: "#4E2B3E",
        imageUrl:
          "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "saia-midi-soleil",
    code: "LEA-056",
    name: "Saia Midi Plissada Soleil",
    category: "Vestidos",
    price: 329.0,
    fabric: "Crepe de Seda & Viscose Botânica",
    gramatura: "155 g/m² · Plissado artesanal térmico",
    origin: "Atelier Casa Léa · Jardins, São Paulo",
    editorialLead:
      "Plissado soleil graduado que se abre em movimento escultural a cada passo.",
    description:
      "Modelada em roda com pregas que nascem finas no quadril e se expandem até a barra assimétrica. Fechamento lateral por zíper invisível e cós em gorgurão fosco.",
    fitNotes:
      "Ajuste preciso na cintura natural com total liberdade no quadril.",
    care: [
      "Lavar à mão sem esfregar as pregas",
      "Secar na vertical em cabide com presilhas acolchoadas",
      "Não passar ferro diretamente sobre o plissado",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "manteiga-solar",
        name: "Manteiga Solar",
        hex: "#EFE2C4",
        weaveAccentHex: "#D4C29A",
        imageUrl:
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "cacau-rosado",
        name: "Cacau Rosado",
        hex: "#7A4957",
        weaveAccentHex: "#5B323E",
        imageUrl:
          "https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "vestido-longo-amelia",
    code: "LEA-068",
    name: "Vestido Longo Decote Costas Amélia",
    category: "Vestidos",
    price: 559.0,
    fabric: "Seda Rústica & Linho Fino",
    gramatura: "170 g/m² · Acabamento em costura francesa",
    origin: "Atelier Casa Léa · Jardins, São Paulo",
    editorialLead:
      "Frente minimalista em coluna contínua revelando decote geométrico profundo nas costas.",
    description:
      "Pensado para celebrações ao entardecer. O Vestido Amélia traz barra longa rente ao tornozelo, faixa fina de sustentação nas costas com fivela revestida no próprio tecido e toque fresco.",
    fitNotes:
      "Modelagem alongada. Possui pences internas que garantem segurança no decote posterior.",
    care: [
      "Limpeza delicada a úmido ou a seco",
      "Secar à sombra longe de fontes de calor",
      "Vaporizar pelo avesso",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "figo-imperial",
        name: "Figo Imperial",
        hex: "#6E2A44",
        weaveAccentHex: "#2A1621",
        imageUrl:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "marfim-galeria",
        name: "Marfim Galeria",
        hex: "#F2EFE9",
        weaveAccentHex: "#D5CEC2",
        imageUrl:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "camisa-algodao-brisa",
    code: "LEA-074",
    name: "Camisa Algodão Egípcio Brisa",
    category: "Blusas & Seda",
    price: 259.0,
    fabric: "100% Algodão Egípcio Fio 80",
    gramatura: "120 g/m² · Trama acetinada respirável",
    origin: "Confecção autoral · São Paulo",
    editorialLead:
      "Punhos largos de alfaiataria e vista oculta para uma estética limpa e atemporal.",
    description:
      "A camisa branca repensada com proporções femininas contemporâneas. Fio 80 de fibra extralonga que não forma pilling, gola entretelada macia e fendas laterais arredondadas.",
    fitNotes:
      "Modelagem levemente ampla (relaxed tailoring). Para efeito mais justo, escolha um tamanho menor.",
    care: [
      "Lavagem em máquina no saco protetor a 30°C",
      "Secar em cabide para facilitar a passadoria",
      "Passar com ferro a vapor",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "branco-galeria",
        name: "Branco Galeria",
        hex: "#FAF9FB",
        weaveAccentHex: "#DFDCE3",
        imageUrl:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "celeste-poeira",
        name: "Celeste Poeira",
        hex: "#D5DEE5",
        weaveAccentHex: "#AEBCC7",
        imageUrl:
          "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
  {
    id: "bolsa-couro-trancado-atelier",
    code: "LEA-089",
    name: "Bolsa Couro Trançado Atelier",
    category: "Acessórios",
    price: 549.0,
    fabric: "100% Couro Bovino Curtimento Vegetal",
    gramatura: "Tiras de 8 mm trançadas manualmente",
    origin: "Artesãs parceiras · Serra Gaúcha & SP",
    editorialLead:
      "Trama manual sem ferragens aparentes com bolsa interna removível em linho cru.",
    description:
      "Cada peça leva 14 horas de trançado manual com couro de curtimento vegetal livre de metais pesados. Acompanha nécessaire interna em linho puro com fechamento em cordão encerado.",
    fitNotes:
      "Dimensões: 34 cm (largura) × 26 cm (altura) × 13 cm (profundidade). Alça confortável para ombro ou mão.",
    care: [
      "Limpar apenas com flanela seca e macia",
      "Hidratar semestralmente com cera natural incolor",
      "Guardar na dustbag de algodão Casa Léa inclusa",
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: [
      {
        id: "ameixa-sela",
        name: "Ameixa Sela",
        hex: "#3E1F2C",
        weaveAccentHex: "#2A1621",
        imageUrl:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
      {
        id: "amendoa-natural",
        name: "Amêndoa Natural",
        hex: "#C5A384",
        weaveAccentHex: "#A48060",
        imageUrl:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=640&q=70&fm=webp",
        detailImageUrl:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=70&fm=webp",
      },
    ],
  },
];

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calculateShippingByCep(
  rawCep: string,
  subtotal: number
): ShippingQuote | null {
  const digits = rawCep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const formattedCep = `${digits.slice(0, 5)}-${digits.slice(5)}`;
  const firstDigit = parseInt(digits[0], 10);
  const qualifiesFree = subtotal >= FRETE_GRATIS_MINIMO;

  if (firstDigit === 0 || firstDigit === 1) {
    return {
      cep: formattedCep,
      regionName: "São Paulo · Capital & Interior",
      carrier: qualifiesFree
        ? "Mensageiro Casa Léa · Cortesia"
        : "Entrega Expressa Atelier",
      days: "1 a 2 dias úteis",
      cost: qualifiesFree ? 0 : 24.9,
      isFreeByThreshold: qualifiesFree,
    };
  }

  if (firstDigit === 2 || firstDigit === 3) {
    return {
      cep: formattedCep,
      regionName: "Sudeste (RJ · MG · ES)",
      carrier: qualifiesFree ? "SEDEX Cortesia Casa Léa" : "SEDEX Segurado",
      days: "2 a 3 dias úteis",
      cost: qualifiesFree ? 0 : 32.9,
      isFreeByThreshold: qualifiesFree,
    };
  }

  if (firstDigit === 8 || firstDigit === 9) {
    return {
      cep: formattedCep,
      regionName: "Região Sul (PR · SC · RS)",
      carrier: qualifiesFree ? "Envio Prioritário Cortesia" : "Transportadora Aérea",
      days: "3 a 4 dias úteis",
      cost: qualifiesFree ? 0 : 36.9,
      isFreeByThreshold: qualifiesFree,
    };
  }

  return {
    cep: formattedCep,
    regionName: "Capitais & Demais Regiões do Brasil",
    carrier: qualifiesFree ? "Envio Nacional Cortesia" : "Envio Aéreo Segurado",
    days: "4 a 6 dias úteis",
    cost: qualifiesFree ? 0 : 44.9,
    isFreeByThreshold: qualifiesFree,
  };
}
