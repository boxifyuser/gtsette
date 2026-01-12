import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, HandshakeIcon, LineChart, ShieldCheck, TrendingDown, UserCheck } from "lucide-react"
import Link from "next/link"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export const metadata: Metadata = {
  title: "Serviços - Limpa Nome, Negociação de Dívidas e Recuperação de Crédito",
  description:
    "Conheça nossos serviços: Limpeza de Nome, Negociação de Dívidas, Análise de Crédito, Consultoria Financeira e muito mais. Mais de 40 mil clientes atendidos.",
  openGraph: {
    title: "Serviços GTSETTE - Limpa Nome e Recuperação de Crédito",
    description:
      "Soluções completas para recuperar seu crédito: Limpeza de Nome, Negociação de Dívidas, Aumento de Score e muito mais.",
    url: `${siteUrl}/servicos`,
  },
}

export default function ServicosPage() {
  const services = [
    {
      icon: ShieldCheck,
      title: "Limpeza de Nome",
      description: "Remoção de restrições em órgãos como Serasa, SPC, Boa Vista e outros bureaus de crédito.",
      features: [
        "Análise completa das restrições",
        "Negociação com credores",
        "Acompanhamento até a baixa total",
        "Consultoria pós-limpeza",
      ],
    },
    {
      icon: HandshakeIcon,
      title: "Negociação de Dívidas",
      description: "Buscamos as melhores condições para quitação das suas dívidas com descontos significativos.",
      features: [
        "Até 90% de desconto",
        "Parcelamento facilitado",
        "Negociação direta com credores",
        "Acordo formalizado",
      ],
    },
    {
      icon: LineChart,
      title: "Análise de Crédito",
      description: "Avaliação detalhada da sua situação financeira para traçar a melhor estratégia.",
      features: ["Diagnóstico completo", "Score de crédito", "Plano personalizado", "Orientação especializada"],
    },
    {
      icon: FileText,
      title: "Consultoria Financeira",
      description: "Orientação profissional para reorganizar suas finanças e evitar novos endividamentos.",
      features: ["Planejamento financeiro", "Controle de gastos", "Estratégias de economia", "Educação financeira"],
    },
    {
      icon: TrendingDown,
      title: "Redução de Juros",
      description: "Renegociação de contratos para reduzir taxas de juros abusivas.",
      features: ["Revisão contratual", "Identificação de juros abusivos", "Negociação de taxas", "Economia mensal"],
    },
    {
      icon: UserCheck,
      title: "Acompanhamento Dedicado",
      description: "Um consultor exclusivo para acompanhar todo o seu processo de recuperação.",
      features: [
        "Atendimento personalizado",
        "Atualizações em tempo real",
        "Suporte via WhatsApp",
        "Relatórios mensais",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-primary px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Nossos Serviços</h1>
          <p className="max-w-2xl text-balance text-lg text-white/90">
            Soluções completas para recuperar seu crédito e transformar sua vida financeira.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Como Funciona</h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
              Um processo simples e transparente para sua recuperação de crédito
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Consulta Inicial", description: "Analisamos sua situação de crédito" },
              { step: "02", title: "Planejamento", description: "Criamos estratégia personalizada" },
              { step: "03", title: "Negociação", description: "Negociamos com os credores" },
              { step: "04", title: "Conclusão", description: "Seu nome limpo e crédito recuperado" },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 3 && <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-primary/20 md:block" />}
                <div className="relative text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Pronto Para Começar?</h2>
          <p className="mb-8 text-balance text-lg text-white/90">
            Entre em contato conosco e descubra como podemos ajudar você.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-accent text-white hover:bg-accent/90">
              <Link href="/consulta">Verificar Status</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/contato">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
