import type { Metadata } from "next"
import { HeroFormImovel } from "@/components/forms/hero-form-imovel"
import { Button } from "@/components/ui/button"
import {
  Check,
  FileCheck,
  TrendingUp,
  UserCheck,
  MessageCircle,
  Car,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const WHATSAPP_URL = "https://wa.me/5531987654321"
const WHATSAPP_MSG_VEICULO =
  "Olá! Quero financiar um carro e preciso organizar meu nome. Pode me ajudar?"

export const metadata: Metadata = {
  title: "Aprovação para Financiamento de Veículo",
  description:
    "Quer financiar um carro, mas seu nome está negativado? A GTSETTE organiza sua vida financeira e aumenta seu score para você sair dirigindo aprovado.",
  keywords: [
    "financiamento de carro",
    "financiamento veículo",
    "limpa nome",
    "score baixo",
    "crédito negado",
    "comprar carro",
  ],
}

const DORES = [
  "Score baixo",
  "Restrição no CPF",
  "Dívidas acumuladas",
  "Juros altos",
  "Medo de ter crédito negado novamente",
]

const SOLUCOES = [
  {
    titulo: "Negociação de Dívidas",
    descricao:
      "Até 90% de desconto, parcelamento facilitado e negociação direta com credores.",
    icon: FileCheck,
  },
  {
    titulo: "Limpeza de Nome",
    descricao:
      "Remoção de restrições e acompanhamento até baixa definitiva nos órgãos de proteção ao crédito.",
    icon: TrendingUp,
  },
  {
    titulo: "Análise de Crédito",
    descricao:
      "Diagnóstico completo e plano estratégico de aumento de score para aprovação.",
    icon: UserCheck,
  },
  {
    titulo: "Acompanhamento Dedicado",
    descricao:
      "Consultor exclusivo e monitoramento do processo até você ser aprovado.",
    icon: MessageCircle,
  },
]

const BENEFICIOS = [
  "Mais chances de aprovação",
  "Melhora no score",
  "Economia com juros",
  "Segurança jurídica nos acordos",
]

export default function FinanciamentoVeiculoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 px-6 py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/banner-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" aria-hidden />
        <div className="container relative z-10 mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Car className="h-4 w-4" />
            <span>Financiamento de veículo</span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Quer financiar um carro, mas seu nome está negativado?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            A GTSETTE organiza sua vida financeira e aumenta seu score para você
            sair dirigindo seu carro aprovado.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 bg-primary px-8 text-base font-semibold text-white shadow-lg hover:bg-primary-hover"
            >
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_VEICULO)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Quero aumentar minhas chances de aprovação
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 border-2 border-white/60 bg-white/10 px-8 text-white hover:bg-white/20">
              <Link href="/consulta">Simular minha situação</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dores */}
      <section className="border-b border-gray-200 bg-white px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Essas dores são suas?
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DORES.map((item) => (
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

      {/* Solução GTSETTE */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Nossa atuação
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Solução GTSETTE
          </h2>
          <p className="mb-12 max-w-2xl text-gray-600">
            Tudo que você precisa para sair do nome sujo e ser aprovado no
            financiamento do veículo.
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

      {/* Benefícios */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Benefícios
          </p>
          <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            O que você conquista
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
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_VEICULO)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Quero aumentar minhas chances de aprovação
            </a>
          </Button>
        </div>
      </section>

      {/* Formulário Receba uma proposta */}
      <section className="border-t border-gray-200 bg-white px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-md justify-center">
            <HeroFormImovel pageSlug="financiamento-veiculo" />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Pronto para financiar seu carro?
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
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MSG_VEICULO)}`}
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
