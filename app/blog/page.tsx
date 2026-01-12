import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export default function Blog() {
  const categories = [
    { name: "Limpa Nome", slug: "limpa-nome", count: 12 },
    { name: "Score", slug: "score", count: 8 },
    { name: "Dívidas", slug: "dividas", count: 15 },
    { name: "Organização Financeira", slug: "organizacao", count: 10 },
  ]

  const posts = [
    {
      title: "Como Limpar Seu Nome em 5 Passos Simples",
      excerpt: "Descubra o passo a passo completo para regularizar seu CPF e voltar a ter crédito no mercado.",
      category: "Limpa Nome",
      date: "15 Jan 2025",
      slug: "como-limpar-seu-nome",
    },
    {
      title: "O Que é Score de Crédito e Como Aumentar o Seu",
      excerpt: "Entenda como funciona o sistema de pontuação de crédito e aprenda estratégias para melhorar sua nota.",
      category: "Score",
      date: "12 Jan 2025",
      slug: "o-que-e-score-de-credito",
    },
    {
      title: "Negociação de Dívidas: 7 Dicas Para Conseguir Descontos",
      excerpt: "Aprenda técnicas eficazes para negociar suas dívidas e conseguir as melhores condições de pagamento.",
      category: "Dívidas",
      date: "10 Jan 2025",
      slug: "negociacao-de-dividas-dicas",
    },
    {
      title: "Organizando Suas Finanças: Um Guia Para Iniciantes",
      excerpt: "Comece sua jornada de organização financeira com este guia completo e prático para sair das dívidas.",
      category: "Organização Financeira",
      date: "8 Jan 2025",
      slug: "organizando-financas-guia",
    },
    {
      title: "Como Evitar Cair em Novas Dívidas Depois de Limpar o Nome",
      excerpt: "Estratégias essenciais para manter suas finanças saudáveis e evitar voltar ao endividamento.",
      category: "Organização Financeira",
      date: "5 Jan 2025",
      slug: "evitar-novas-dividas",
    },
    {
      title: "Mitos e Verdades Sobre Recuperação de Crédito",
      excerpt: "Descubra o que é fato e o que é mito quando o assunto é limpeza de nome e recuperação de crédito.",
      category: "Limpa Nome",
      date: "3 Jan 2025",
      slug: "mitos-verdades-recuperacao-credito",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl">Blog GTSETTE</h1>
          <p className="text-balance text-lg text-white/90 md:text-xl">
            Conhecimento e dicas para transformar sua vida financeira
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-background px-6 py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full bg-transparent">
              Todos os Posts
            </Button>
            {categories.map((cat) => (
              <Button key={cat.slug} variant="outline" className="rounded-full bg-transparent">
                {cat.name} ({cat.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-background px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5" />

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary">{post.title}</h3>
                  <p className="mb-4 flex-1 text-gray-700">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3"
                  >
                    Ler mais <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <Button variant="outline" className="rounded-full bg-transparent">
              Anterior
            </Button>
            <Button className="rounded-full bg-primary hover:bg-primary-hover">1</Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              2
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              3
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Próxima
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Pronto para limpar seu nome?</h2>
          <p className="mb-8 text-balance text-lg text-gray-700">
            Não espere mais. Comece hoje sua jornada de recuperação financeira.
          </p>
          <Button asChild size="lg" className="h-12 bg-primary px-8 text-white hover:bg-primary-hover">
            <Link href="/consulta">Consultar meu CPF agora</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
