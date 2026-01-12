import { Card, CardContent } from "@/components/ui/card"
import { Award, Eye, Heart, Target, TrendingUp } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Welcome Message */}
      <section className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent">
              <div className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide text-accent">Sobre nós</span>
          </div>

          <h1 className="mb-8 max-w-4xl text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
            Bem-Vindo a GTsette sua parceira confiável na jornada de reabilitação financeira.
          </h1>

          <p className="mb-16 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Acreditamos na transparência como pilar fundamental em todos os nossos relacionamentos. Comunicamos
            abertamente com nossos clientes, garantindo que compreendam cada passo do processo de limpeza de nome e
            recuperação de crédito.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Nossa Visão */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-accent">Nossa Visão</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Nós da GTsette vislumbramos um futuro onde cada indivíduo e empresa tenha a oportunidade de construir
                  um caminho financeiro sólido, livre de obstáculos e restrições. Nossa visão é ser a principal
                  referência em serviços de limpeza de nome, destacando-nos como a escolha inquestionável para aqueles
                  que buscam restaurar sua saúde financeira.
                </p>
              </div>
            </div>

            {/* Nossa Missão */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-accent">Nossa Missão</h2>
                <div className="space-y-4 leading-relaxed text-muted-foreground">
                  <p>
                    Nossa missão é proporcionar uma segunda chance aos nossos clientes, somos líderes no setor de
                    serviços de recuperação de crédito e limpeza de histórico financeiro.
                  </p>
                  <p>
                    Acreditamos que todos merecem uma oportunidade justa e igualitária para construir um futuro
                    financeiro sólido. Nossa missão é capacitar indivíduos e empresas, removendo obstáculos financeiros
                    e oferecendo soluções personalizadas para limpar seus registros de crédito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Conheça a GTSETTE</h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
              Descubra como podemos ajudar você a transformar sua vida financeira
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <video controls className="w-full" poster="/images/logo-gtsette.png">
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VIDEO-GTSETTE-Ql2ppLuCpm6du2IELNSawK3UGBUZz8.mp4" type="video/mp4" />
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="mb-6 text-3xl font-bold">Nossa História</h2>
            <p className="mb-4 text-muted-foreground">
              A GTSETTE Soluções nasceu da necessidade de oferecer um atendimento mais humano e eficiente para pessoas
              que buscam recuperar seu crédito e reconstruir sua vida financeira. Com anos de experiência no mercado,
              nossa equipe é formada por especialistas em negociação, análise de crédito e consultoria financeira.
            </p>
            <p className="mb-4 text-muted-foreground">
              Acreditamos que todos merecem uma segunda chance e que o endividamento não define quem você é. Por isso,
              trabalhamos incansavelmente para encontrar as melhores soluções, sempre com transparência, ética e
              compromisso com resultados reais.
            </p>
            <p className="text-muted-foreground">
              Hoje, somos referência em limpeza de nome e negociação de dívidas, tendo ajudado milhares de pessoas a
              reconquistar sua tranquilidade financeira e realizar seus sonhos.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="bg-muted px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Missão</h3>
                <p className="text-muted-foreground">
                  Oferecer soluções eficazes e personalizadas para recuperação de crédito, transformando a vida
                  financeira dos nossos clientes através de um atendimento humanizado e resultados concretos.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Visão</h3>
                <p className="text-muted-foreground">
                  Ser a empresa mais confiável e inovadora em soluções de recuperação de crédito no Brasil, reconhecida
                  pela excelência no atendimento e pelos resultados transformadores.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Valores</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Transparência total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Ética profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Compromisso com resultados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Atendimento humanizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Inovação constante</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nossos Diferenciais</h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
              O que nos torna únicos no mercado de recuperação de crédito
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 rounded-lg border bg-card p-6">
              <Award className="h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Equipe Especializada</h3>
                <p className="text-sm text-muted-foreground">
                  Profissionais certificados com anos de experiência em negociação e análise de crédito.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg border bg-card p-6">
              <Award className="h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Tecnologia Avançada</h3>
                <p className="text-sm text-muted-foreground">
                  Sistemas integrados para acompanhamento em tempo real do seu processo.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg border bg-card p-6">
              <Award className="h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Parcerias Consolidadas</h3>
                <p className="text-sm text-muted-foreground">
                  Relacionamento direto com principais instituições financeiras e bureaus de crédito.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg border bg-card p-6">
              <Award className="h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Atendimento Personalizado</h3>
                <p className="text-sm text-muted-foreground">
                  Cada cliente tem um consultor dedicado para acompanhar todo o processo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-primary px-4 py-16 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Resultados que Falam por Si</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">10k+</div>
              <p className="text-white/80">Clientes Atendidos</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">95%</div>
              <p className="text-white/80">Taxa de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">R$ 50M+</div>
              <p className="text-white/80">Negociados</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">8 anos</div>
              <p className="text-white/80">No Mercado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
