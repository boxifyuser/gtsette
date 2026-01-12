import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, TrendingUp, Users, Star, Phone, Play, Instagram, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100 px-6 py-16 lg:py-24">
        {/* Decorative curved shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-300/40 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="text-left">
              {/* Badge with Icon */}
              <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span>Início</span>
              </div>

              {/* Main Headline */}
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-primary lg:text-6xl xl:text-7xl">
                LIMPE
                <br />O SEU NOME
              </h1>

              {/* Description */}
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                Na GTsette, <strong>nós não acreditamos em limites quando se trata de limpar seu nome</strong>. Seja
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
                  className="h-14 border-2 border-sky-400 bg-white px-8 text-base font-semibold text-sky-600 hover:bg-sky-50"
                >
                  <Link href="/servicos">Conhecer serviços</Link>
                </Button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <div className="relative">
                <Image
                  src="/images/foto-tayna-com-texto.png"
                  alt="Miga do limpa nome - Tayna, especialista GTSETTE"
                  width={600}
                  height={800}
                  className="object-contain"
                  priority
                />
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

      {/* Services Section */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Nossos Serviços</h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-700">
              Soluções completas para você retomar sua vida financeira
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Limpa Nome</h3>
              <p className="text-gray-700">
                Regularize seu CPF e limpe seu nome das restrições de crédito com agilidade e transparência.
              </p>
            </div>
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Negociação de Dívidas</h3>
              <p className="text-gray-700">Negociamos suas dívidas com as melhores condições e descontos do mercado.</p>
            </div>
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Aumento de Score</h3>
              <p className="text-gray-700">
                Estratégias comprovadas para aumentar seu score de crédito de forma sustentável.
              </p>
            </div>
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Regularização Financeira</h3>
              <p className="text-gray-700">
                Organize sua vida financeira e recupere seu poder de compra com nossa consultoria especializada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Reels Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Instagram className="h-5 w-5" />
              Siga-nos no Instagram
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Veja nossos Reels</h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-700">
              Acompanhe dicas, histórias de sucesso e conteúdo exclusivo sobre recuperação de crédito
            </p>
          </div>

          {/* Instagram CTA Button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-xl"
            >
              <a
                href="https://www.instagram.com/gtsette_solucoes/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="h-5 w-5" />
                Siga no Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Office Location Section */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <MapPin className="h-5 w-5" />
              Nosso Escritório
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Visite-nos em Belo Horizonte</h2>
            <p className="mx-auto max-w-2xl text-balance text-gray-700">
              Estamos localizados no coração de BH, prontos para atendê-lo pessoalmente
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left Side - Video */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <video controls className="w-full" poster="/images/escritorio-thumb.jpg" preload="metadata">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nosso%20escrit%C3%B3rio-xvcT1pSiiQMN1rOTJ5wCU6xrzSBHC1.mp4" type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                {/* Address Overlay */}
                <div className="relative">
                  <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-primary to-primary/90 px-6 py-4 text-white">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-6 w-6 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Av. Augusto de Lima, 407 – Loja 11</p>
                        <p className="text-sm text-white/90">Lourdes – Belo Horizonte/MG</p>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.4866755489735!2d-43.94376!3d-19.931944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa699de2d8deaa5%3A0x6db0a9c0c0a0c0a0!2sAv.%20Augusto%20de%20Lima%2C%20407%20-%20Loja%2011%20-%20Centro%2C%20Belo%20Horizonte%20-%20MG!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                    width="100%"
                    height="450"
                    style={{ border: 0, display: "block", paddingTop: "84px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização GTSETTE Soluções"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-primary text-white hover:bg-primary-hover">
                  <a
                    href="https://www.google.com/maps/dir//Av.+Augusto+de+Lima,+407+-+Loja+11+-+Lourdes,+Belo+Horizonte+-+MG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-5 w-5" />
                    Como Chegar
                  </a>
                </Button>
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
