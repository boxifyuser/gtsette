import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  Check,
  FileCheck,
  TrendingUp,
  Percent,
  UserCheck,
  MessageCircle,
  Home,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { HeroFormImovel } from "@/components/forms/hero-form-imovel"

const WHATSAPP_URL = "https://wa.me/5531982506478"
const WHATSAPP_MSG_IMOVEL =
  "Olá! Quero aumentar minhas chances de aprovação no financiamento imobiliário."

export const metadata: Metadata = {
  title: "Aprovação para Financiamento Imobiliário",
  description:
    "Seu financiamento foi negado? Regularize seu nome e aumente seu score para conquistar sua casa própria. GTSETTE prepara você para ser aprovado.",
  keywords: [
    "financiamento imobiliário",
    "casa própria",
    "limpa nome",
    "score baixo",
    "financiamento negado",
    "regularização CPF",
  ],
}

const PROBLEMAS = [
  "Nome negativado",
  "Score baixo",
  "Restrição no Serasa/SPC",
  "Banco recusou seu crédito",
  "Juros abusivos atrapalhando",
]

const SOLUCOES = [
  {
    titulo: "Limpeza de Nome",
    descricao:
      "Remoção de restrições (Serasa, SPC, Boa Vista), negociação direta com credores e acompanhamento até a baixa total.",
    icon: FileCheck,
  },
  {
    titulo: "Análise de Crédito",
    descricao:
      "Diagnóstico completo, avaliação do score e estratégia personalizada para aprovação.",
    icon: TrendingUp,
  },
  {
    titulo: "Redução de Juros",
    descricao:
      "Revisão contratual, identificação de juros abusivos e renegociação.",
    icon: Percent,
  },
  {
    titulo: "Consultoria Financeira",
    descricao:
      "Planejamento para aprovação, organização financeira e orientação estratégica.",
    icon: UserCheck,
  },
]

const BENEFICIOS = [
  "Até 90% de desconto nas dívidas",
  "Acordos formalizados",
  "Parcelamentos facilitados",
  "Consultor exclusivo até a aprovação",
]

export default function FinanciamentoImovelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 px-4 py-8 sm:px-6 sm:py-12 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/banner-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" aria-hidden />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* No mobile: formulário primeiro (order-1). No desktop: texto à esquerda, form à direita. */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Casa própria</span>
              </div>
              <h1 className="mt-4 text-xl font-extrabold leading-snug text-white sm:mt-6 sm:text-3xl sm:leading-tight md:text-4xl lg:text-5xl xl:text-6xl">
                Seu financiamento foi negado? Regularize seu nome e aumente seu score
                para conquistar sua casa própria.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base lg:text-lg">
                A GTSETTE Soluções Financeiras prepara você para ser aprovado no
                financiamento imobiliário com estratégia, negociação e acompanhamento
                completo.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4 lg:flex-col xl:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-11 bg-primary px-5 text-sm font-semibold text-white shadow-lg hover:bg-primary-hover sm:h-12 sm:px-6 sm:text-base lg:h-14 lg:px-8"
                >
                  <a
                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_IMOVEL)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Quero aumentar minhas chances de aprovação agora
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 border-2 border-white/60 bg-white/10 px-5 text-sm text-white hover:bg-white/20 sm:h-12 sm:px-6 sm:text-base lg:h-14 lg:px-8">
                  <Link href="/consulta">Simular minha situação</Link>
                </Button>
              </div>
            </div>
            {/* Formulário: no mobile aparece no topo (order-1) */}
            <div className="order-1 lg:order-2 lg:flex lg:justify-end">
              <div className="w-full max-w-md lg:max-w-sm">
                <HeroFormImovel pageSlug="financiamento-imovel" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="border-b border-gray-200 bg-white px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Você está passando por isso?
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

      {/* Como a GTSETTE resolve */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Nossa atuação
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Como a GTSETTE resolve
          </h2>
          <p className="mb-12 max-w-2xl text-gray-600">
            Serviços integrados para você chegar na aprovação do financiamento.
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
                <p className="text-sm leading-relaxed text-gray-600">
                  {descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposta de valor */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Proposta de valor
          </p>
          <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            O que você ganha com a GTSETTE
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
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_IMOVEL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Quero aumentar minhas chances de aprovação agora
            </a>
          </Button>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Pronto para conquistar sua casa própria?
          </h2>
          <p className="mb-8 text-white/90">
            Fale com um consultor no WhatsApp ou consulte seu CPF para dar o
            primeiro passo.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white text-primary hover:bg-white/90"
            >
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_IMOVEL)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-2 border-white bg-transparent text-white hover:bg-white/10">
              <Link href="/consulta">Consultar meu CPF</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
