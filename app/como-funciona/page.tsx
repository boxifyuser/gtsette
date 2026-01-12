import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, FileText, Handshake, CheckCircle2 } from "lucide-react"

export default function ComoFunciona() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Você consulta seu CPF",
      description:
        "Preencha seus dados de forma rápida e segura. Em segundos, analisamos sua situação financeira atual.",
    },
    {
      number: 2,
      icon: FileText,
      title: "Analisamos sua situação",
      description:
        "Nossa equipe de especialistas avalia todas as suas pendências e identifica as melhores oportunidades de negociação.",
    },
    {
      number: 3,
      icon: Handshake,
      title: "Negociamos suas dívidas",
      description:
        "Entramos em contato com os credores e negociamos descontos e condições especiais para você quitar suas dívidas.",
    },
    {
      number: 4,
      icon: CheckCircle2,
      title: "Regularizamos seu CPF",
      description:
        "Após os pagamentos, seu nome é limpo e você recupera seu crédito. Acompanhamos todo o processo até a conclusão.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl">Como Funciona</h1>
          <p className="text-balance text-lg text-white/90 md:text-xl">
            Processo simples e transparente para você retomar sua vida financeira
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative grid gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg md:grid-cols-[auto,1fr]"
              >
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                    {step.number}
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-lg leading-relaxed text-gray-700">{step.description}</p>
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-full h-12 w-0.5 -translate-x-1/2 bg-border md:left-12" />
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="mb-6 text-lg text-gray-700">Pronto para começar sua jornada de recuperação financeira?</p>
            <Button asChild size="lg" className="h-12 bg-primary px-8 text-white hover:bg-primary-hover">
              <Link href="/consulta">Consultar meu CPF agora</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Por que escolher a GTSETTE?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">100% Seguro</h3>
              <p className="text-gray-700">Seus dados protegidos com criptografia de ponta</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Processo Rápido</h3>
              <p className="text-gray-700">Resultados em até 30 dias</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Melhores Descontos</h3>
              <p className="text-gray-700">Negociamos as melhores condições para você</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
