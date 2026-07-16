import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  BarChart3,
  Check,
  CreditCard,
  LineChart,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { HeroFormImovel } from "@/components/forms/hero-form-imovel"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : ""
const WHATSAPP_MSG =
  "Olá! Quero saber mais sobre Rating Bancário e elevar minha classificação no Serasa/Concentre."

export const metadata: Metadata = {
  title: "Rating Bancário — Elevação para AA no Serasa e Concentre",
  description:
    "Entenda o que é rating bancário e como a GTSETTE eleva sua classificação para AA no Serasa e Concentre, abrindo linhas de crédito com melhores condições.",
  keywords: [
    "rating bancário",
    "classificação AA",
    "Serasa Concentre",
    "score bancário",
    "linha de crédito",
    "melhorar rating",
  ],
  openGraph: {
    title: "Rating Bancário | GTSETTE Soluções",
    description:
      "Aumente sua pontuação para AA no Serasa/Concentre e abra novas oportunidades de crédito.",
    url: `${siteUrl}/rating-bancario`,
  },
}

const PROBLEMAS = [
  "Classificação baixa no Serasa ou Concentre",
  "Bancos recusando crédito ou cobrando juros altos",
  "Limite de cartão e cheque especial reduzidos",
  "Dificuldade para financiar imóvel ou veículo",
  "Histórico que impede novas linhas de crédito",
]

const O_QUE_E = [
  {
    titulo: "O que é rating bancário?",
    descricao:
      "É a classificação que bancos e instituições financeiras usam para medir o risco de crédito de uma pessoa ou empresa. Quanto melhor o rating, maior a confiança e melhores as condições oferecidas.",
    icon: BarChart3,
  },
  {
    titulo: "Serasa e Concentre",
    descricao:
      "O Concentre (SCR do Banco Central, acessado via Serasa e outros bureaus) mostra o relacionamento com o sistema financeiro. Um rating elevado nessas bases abre portas para crédito com juros mais competitivos.",
    icon: LineChart,
  },
  {
    titulo: "Classificação AA",
    descricao:
      "AA é uma das melhores faixas de risco. Quem chega nesse patamar costuma ter mais acesso a crédito, limites maiores e taxas mais atrativas — o objetivo do nosso trabalho de elevação de rating.",
    icon: TrendingUp,
  },
]

const SOLUCOES = [
  {
    titulo: "Diagnóstico do rating",
    descricao:
      "Avaliamos sua posição no Serasa, Concentre e demais bases para entender o que puxa a classificação para baixo.",
    icon: LineChart,
  },
  {
    titulo: "Estratégia de elevação",
    descricao:
      "Montamos um plano personalizado para subir a pontuação rumo à classificação AA, com etapas claras e acompanhamento.",
    icon: TrendingUp,
  },
  {
    titulo: "Regularização e crédito",
    descricao:
      "Alinhamos limpeza de restrições, organização financeira e posicionamento perante o sistema bancário para liberar novas linhas.",
    icon: ShieldCheck,
  },
  {
    titulo: "Novas oportunidades",
    descricao:
      "Com o rating melhorado, você volta a negociar cartões, empréstimos e financiamentos em condições mais justas.",
    icon: CreditCard,
  },
]

const BENEFICIOS = [
  "Elevação do score rumo à classificação AA",
  "Melhoria no Serasa e Concentre",
  "Abertura de linhas de crédito",
  "Oportunidades com melhores taxas e limites",
  "Consultor dedicado durante o processo",
]

const NIVEIS = [
  { faixa: "AA / A", significado: "Baixo risco — melhores condições de crédito" },
  { faixa: "B / C", significado: "Risco moderado — crédito possível com restrições" },
  { faixa: "D / E", significado: "Risco elevado — juros altos ou recusa frequente" },
  { faixa: "F / H", significado: "Alto risco — acesso muito limitado ao crédito" },
]

export default function RatingBancarioPage() {
  const whatsappHref = WHATSAPP_URL
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG)}`
    : "#"

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-gray-900 px-4 py-8 sm:px-6 sm:py-12 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/banner-hero.png')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
          aria-hidden
        />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Rating Bancário</span>
              </div>
              <h1 className="mt-4 text-xl font-extrabold leading-snug text-white sm:mt-6 sm:text-3xl sm:leading-tight md:text-4xl lg:text-5xl">
                Aumente sua pontuação para AA no Serasa e Concentre
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base lg:text-lg">
                O rating bancário define como o mercado enxerga o seu risco de crédito. A
                GTSETTE trabalha para elevar sua classificação, abrir linhas de crédito e
                melhorar as condições oferecidas por bancos e financeiras.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-11 bg-primary px-5 text-sm font-semibold text-white shadow-lg hover:bg-primary-hover sm:h-12 sm:px-6 sm:text-base lg:h-14 lg:px-8"
                >
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Quero elevar meu rating agora
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 border-2 border-white/60 bg-white/10 px-5 text-sm text-white hover:bg-white/20 sm:h-12 sm:px-6 sm:text-base lg:h-14 lg:px-8"
                >
                  <Link href="/consulta">Consultar meu CPF</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:flex lg:justify-end">
              <div className="w-full max-w-md lg:max-w-sm">
                <HeroFormImovel pageSlug="rating-bancario" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Isso parece com a sua situação?
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMAS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Entenda
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            O que é rating bancário e por que importa
          </h2>
          <p className="mb-12 max-w-2xl text-gray-600">
            Antes de pedir crédito, o banco olha o seu rating. Entender essa nota é o
            primeiro passo para mudá-la.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {O_QUE_E.map(({ titulo, descricao, icon: Icon }) => (
              <div
                key={titulo}
                className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{titulo}</h3>
                <p className="leading-relaxed text-gray-600">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Classificação
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Faixas de rating e o que elas significam
          </h2>
          <p className="mb-10 max-w-2xl text-gray-600">
            Em linhas gerais, instituições usam faixas de risco. Nosso foco é levar você
            para as melhores classificações — incluindo AA.
          </p>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {NIVEIS.map((nivel) => (
                <li
                  key={nivel.faixa}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="text-lg font-bold text-primary">{nivel.faixa}</span>
                  <span className="text-gray-600 sm:text-right">{nivel.significado}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Nossa atuação
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Como a GTSETTE eleva o seu rating
          </h2>
          <p className="mb-12 max-w-2xl text-gray-600">
            Processo orientado a resultado: diagnóstico, plano, execução e abertura de
            novas oportunidades de crédito.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUCOES.map(({ titulo, descricao, icon: Icon }) => (
              <div
                key={titulo}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{titulo}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Proposta de valor
          </p>
          <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            O que você conquista com um rating melhor
          </h2>
          <ul className="mx-auto flex max-w-2xl flex-col gap-4 text-left sm:grid sm:grid-cols-2">
            {BENEFICIOS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button
            asChild
            size="lg"
            className="mt-10 h-14 bg-primary px-8 text-base font-semibold text-white hover:bg-primary-hover"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Quero elevar meu rating agora
            </a>
          </Button>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Pronto para melhorar seu rating bancário?
          </h2>
          <p className="mb-8 text-white/90">
            Fale com um consultor no WhatsApp ou consulte seu CPF e descubra o caminho
            até a classificação AA.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-white text-primary hover:bg-white/90">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/consulta">Consultar meu CPF</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
