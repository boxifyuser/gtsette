import { HeroFormImovel } from "@/components/forms/hero-form-imovel"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { DepoimentoCard } from "@/components/depoimento-card"
import { Star, Phone, Play, MapPin } from "lucide-react"
import fs from "fs"
import Link from "next/link"
import path from "path"

const VIDEO_HERO_POSTER = "/images/escritorio-thumb.jpg"
/** URL do vídeo hero; se vazia, exibe só o poster (evita src="" no <source>) */
const videoHeroUrl =
  typeof process.env.NEXT_PUBLIC_VIDEO_HERO_URL === "string"
    ? process.env.NEXT_PUBLIC_VIDEO_HERO_URL.trim() || null
    : null

const DEPOIMENTOS_PADRAO = [
  "/images/depoimentos/depoimento-1.png",
  "/images/depoimentos/depoimento-2.png",
  "/images/depoimentos/depoimento-3.png",
  "/images/depoimentos/depoimento-4.png",
  "/images/depoimentos/depoimento-5.png",
]

function getDepoimentosImagens(): string[] {
  const dir = path.join(process.cwd(), "public", "images", "depoimentos")
  try {
    if (!fs.existsSync(dir)) return DEPOIMENTOS_PADRAO
    const files = fs.readdirSync(dir)
    const depoimentos = files
      .filter((f) => /^depoimento-\d+\.png$/i.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ""), 10) || 0
        const numB = parseInt(b.replace(/\D/g, ""), 10) || 0
        return numA - numB
      })
    if (depoimentos.length === 0) return DEPOIMENTOS_PADRAO
    return depoimentos.map((f) => `/images/depoimentos/${f}`)
  } catch {
    return DEPOIMENTOS_PADRAO
  }
}

const SERVICOS = [
  {
    titulo: "Limpa Nome",
    descricao:
      "Regularizamos seu CPF e CNPJ e limpamos seu nome das restrições de crédito com agilidade e transparência.",
  },
  {
    titulo: "Retirada de Dívidas dos Órgãos",
    descricao:
      "Trabalhamos com a Lei 8078 (CDC), artigos 42 e 43, retirando sua dívida dos órgãos de proteção ao crédito.",
  },
  {
    titulo: "Restauração de Score",
    descricao:
      "Restauramos seu score de crédito de forma sustentável.",
  },
  {
    titulo: "Regularização Financeira",
    descricao:
      "Organize sua vida financeira e recupere seu poder de compra com nossa consultoria especializada.",
  },
] as const

export default function Home() {
  const depoimentosImagens = getDepoimentosImagens()

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
                    href={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "")}` : "#"}
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

            {/* Right: formulário Receba uma proposta */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <HeroFormImovel pageSlug="home" />
              </div>
            </div>
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
                {videoHeroUrl ? (
                  <video
                    controls
                    className="w-full"
                    poster={VIDEO_HERO_POSTER}
                    preload="metadata"
                  >
                    <source src={videoHeroUrl} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                ) : (
                  <img
                    src={VIDEO_HERO_POSTER}
                    alt="GTSETTE Soluções"
                    className="w-full object-cover"
                    width={1200}
                    height={675}
                  />
                )}
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
                Entenda como funcionam nossos serviços e descubra por que somos a escolha de mais de 80 mil pessoas que
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
                href={process.env.NEXT_PUBLIC_INSTAGRAM_REELS_URL ?? process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#"}
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
                  src={process.env.NEXT_PUBLIC_VIDEO_ESCRITORIO_URL ?? ""}
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
                  href={process.env.NEXT_PUBLIC_MAPS_URL_BELO_HORIZONTE ?? "#"}
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
                  href={process.env.NEXT_PUBLIC_MAPS_URL_CUIABA ?? "#"}
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

      {/* Social Proof Section - Carrossel de depoimentos */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">O que nossos clientes dizem</h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-700">
              Mais de 80 mil pessoas já transformaram suas vidas financeiras com a GTSETTE
            </p>
          </div>
          <div className="relative mx-auto max-w-6xl px-4 md:px-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {depoimentosImagens.map((src, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-[calc((100%-2rem)/3)]"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-md">
                      <DepoimentoCard src={src} index={i} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 size-10 border-gray-200 bg-white shadow-md hover:bg-gray-50 md:-left-4" />
              <CarouselNext className="-right-2 size-10 border-gray-200 bg-white shadow-md hover:bg-gray-50 md:-right-4" />
            </Carousel>
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
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">+80k</div>
              <p className="text-gray-700">clientes que limparam nome conosco</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">95%</div>
              <p className="text-gray-700">Taxa de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary md:text-6xl">R$ 150M+</div>
              <p className="text-gray-700">Em Dívidas Retiradas dos Órgãos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
