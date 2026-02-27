import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star, Phone, Play, MapPin } from "lucide-react"
import Link from "next/link"

const SERVICOS = [
  {
    titulo: "Limpa Nome",
    descricao:
      "Regularize seu CPF e limpe seu nome das restrições de crédito com agilidade e transparência.",
  },
  {
    titulo: "Negociação de Dívidas",
    descricao: "Negociamos suas dívidas com as melhores condições e descontos do mercado.",
  },
  {
    titulo: "Aumento de Score",
    descricao:
      "Estratégias comprovadas para aumentar seu score de crédito de forma sustentável.",
  },
  {
    titulo: "Regularização Financeira",
    descricao:
      "Organize sua vida financeira e recupere seu poder de compra com nossa consultoria especializada.",
  },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Banner como background */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gray-900 px-6 py-16 lg:py-24">
        {/* Background: banner com overlay para legibilidade */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/banner-hero.png')" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"
          aria-hidden
        />

        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="grid min-h-[70vh] items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="text-left">
              {/* Badge with Icon */}
              <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white/10">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span>Início</span>
              </div>

              {/* Main Headline */}
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white lg:text-6xl xl:text-7xl">
                LIMPE
                <br />O SEU NOME
              </h1>

              {/* Description */}
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/90">
                Na GTsette, <strong className="text-white">nós não acreditamos em limites quando se trata de limpar seu nome</strong>. Seja
                qual for o valor da sua dívida, estamos aqui para libertar você das amarras financeiras e abrir portas
                para um futuro sem restrições.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 bg-gradient-to-r from-primary via-primary-hover to-primary px-8 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <a
                    href="https://wa.me/5531987654321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Chamar no whatsapp agora!
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 border-2 border-white/60 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Link href="/servicos">Conhecer serviços</Link>
                </Button>
              </div>
            </div>

            {/* Right: o banner já traz a imagem da Tayna e "Miga do limpa nome" no próprio background */}
            <div className="hidden lg:block" aria-hidden />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Video */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <video controls className="w-full" poster="/images/escritorio-thumb.jpg" preload="metadata">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VIDEO-GTSETTE-Ql2ppLuCpm6du2IELNSawK3UGBUZz8.mp4" type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Play className="h-4 w-4" />
                Assista ao vídeo
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Conheça a GTSETTE Soluções</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Entenda como funcionam nossos serviços e descubra por que somos a escolha de mais de 40 mil pessoas que
                recuperaram sua tranquilidade financeira.
              </p>
              <p className="mb-8 text-gray-700">
                Nossa equipe especializada está pronta para encontrar a melhor solução para o seu caso, com
                transparência e compromisso com resultados reais.
              </p>
              <Button asChild size="lg" className="bg-primary text-white hover:bg-primary-hover">
                <Link href="/sobre">Saiba mais sobre nós</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Carousel premium */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              O que fazemos
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Nossos Serviços
            </h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-600">
              Soluções completas para você retomar sua vida financeira
            </p>
          </div>

          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {SERVICOS.map((servico, index) => (
                  <CarouselItem
                    key={servico.titulo}
                    className="pl-2 md:pl-4 shrink-0 basis-[85%] sm:basis-[320px] md:basis-[360px] lg:basis-[380px]"
                  >
                    <div className="group relative h-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md md:p-10">
                      <div
                        className="absolute left-0 top-8 h-12 w-0.5 rounded-full bg-primary/40 transition-colors group-hover:bg-primary"
                        aria-hidden
                      />
                      <div className="pl-4">
                        <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                          {servico.titulo}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {servico.descricao}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 hidden size-10 border-gray-200 bg-white shadow-md hover:bg-gray-50 md:flex lg:-left-4" />
              <CarouselNext className="-right-2 hidden size-10 border-gray-200 bg-white shadow-md hover:bg-gray-50 md:flex lg:-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Instagram / Reels Section - Premium */}
      <section className="border-y border-gray-100 bg-white px-6 py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Conteúdo exclusivo
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Veja nossos Reels
            </h2>
            <p className="mb-10 text-balance text-gray-600">
              Acompanhe dicas, histórias de sucesso e conteúdo exclusivo sobre recuperação de crédito.
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-gray-900 px-8 text-base font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
            >
              <a
                href="https://www.instagram.com/gtsette_solucoes/reels/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Office Location Section - Hero */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-stretch gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
            {/* Lateral esquerda - Vídeo com imagem como thumbnail (poster) */}
            <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-xl ring-1 ring-black/5">
              <video
                controls
                className="h-full w-full object-cover"
                poster="/images/banner-hero.png"
                preload="metadata"
                title="Conheça nosso escritório"
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nosso%20escrit%C3%B3rio-xvcT1pSiiQMN1rOTJ5wCU6xrzSBHC1.mp4"
                  type="video/mp4"
                />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>

            {/* Lateral direita - Título + dois endereços */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <MapPin className="h-5 w-5" />
                Nossos Escritórios
              </div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">Visite-nos</h2>
              <p className="mb-8 text-gray-600">
                Estamos em Belo Horizonte e Cuiabá, prontos para atendê-lo pessoalmente.
              </p>

              {/* Endereço 1 - Belo Horizonte */}
              <div className="flex flex-col gap-2 border-l-4 border-primary py-3 pl-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">Belo Horizonte</span>
                <p className="font-semibold text-gray-900">Av. Augusto de Lima, 407 – Loja 11</p>
                <p className="text-sm text-gray-600">Lourdes – Belo Horizonte/MG</p>
                <a
                  href="https://www.google.com/maps/dir//Av.+Augusto+de+Lima,+407+-+Loja+11+-+Lourdes,+Belo+Horizonte+-+MG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Como chegar
                </a>
              </div>

              {/* Endereço 2 - Cuiabá */}
              <div className="flex flex-col gap-2 border-l-4 border-primary py-3 pl-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">Cuiabá</span>
                <p className="font-semibold text-gray-900">Rua Cândido Mariano, 115 – Centro</p>
                <p className="text-sm text-gray-600">Cuiabá – MT</p>
                <a
                  href="https://www.google.com/maps/dir//Rua+C%C3%A2ndido+Mariano+115,+Centro,+Cuiab%C3%A1+-+MT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Como chegar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">O que nossos clientes dizem</h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-700">
              Mais de 40 mil pessoas já transformaram suas vidas financeiras com a GTSETTE
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Maria Silva",
                text: "Consegui limpar meu nome em menos de 30 dias! Atendimento impecável e transparente.",
              },
              {
                name: "João Santos",
                text: "Negociaram minhas dívidas com descontos incríveis. Hoje tenho crédito de volta!",
              },
              {
                name: "Ana Paula",
                text: "Meu score aumentou 200 pontos em 3 meses. Profissionais sérios e competentes.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-4 text-gray-700">{testimonial.text}</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Pronto Para Limpar Seu Nome?</h2>
          <p className="mb-8 text-balance text-lg text-white/90">
            Consulte seu CPF agora mesmo e dê o primeiro passo para sua liberdade financeira.
          </p>
          <Button asChild size="lg" className="h-12 bg-white px-8 text-primary hover:bg-white/90">
            <Link href="/consulta">Consultar meu CPF agora</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">+40k</div>
              <p className="text-gray-700">Clientes Atendidos</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">95%</div>
              <p className="text-gray-700">Taxa de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">R$ 150M+</div>
              <p className="text-gray-700">Em Dívidas Negociadas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
