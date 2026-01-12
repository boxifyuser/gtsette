import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export const metadata: Metadata = {
  title: "Contato - Fale Conosco",
  description:
    "Entre em contato com a GTSETTE Soluções Financeiras. Estamos prontos para ajudar você a recuperar seu crédito. Atendimento em Belo Horizonte/MG.",
  openGraph: {
    title: "Contato - GTSETTE Soluções Financeiras",
    description:
      "Fale conosco e descubra como podemos ajudar você a limpar seu nome e recuperar seu crédito.",
    url: `${siteUrl}/contato`,
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}