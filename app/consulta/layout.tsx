import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export const metadata: Metadata = {
  title: "Consultar CPF - Verifique sua Situação de Crédito",
  description:
    "Consulte seu CPF agora e descubra sua situação de crédito. Análise completa e gratuita da sua situação financeira.",
  openGraph: {
    title: "Consultar CPF - GTSETTE Soluções Financeiras",
    description: "Verifique sua situação de crédito de forma rápida e segura.",
    url: `${siteUrl}/consulta`,
  },
}

export default function ConsultaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}