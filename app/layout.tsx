import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GTSETTE Soluções Financeiras - Limpa Nome e Recuperação de Crédito",
    template: "%s | GTSETTE Soluções Financeiras",
  },
  description:
    "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 40 mil clientes atendidos. Ética, transparência e resultados reais.",
  keywords: [
    "limpa nome",
    "limpeza de nome",
    "negociação de dívidas",
    "recuperação de crédito",
    "aumento de score",
    "regularização de CPF",
    "restauração financeira",
    "consultoria financeira",
    "limpar nome",
    "score serasa",
    "negociar dívidas",
    "consultar CPF",
    "Belo Horizonte",
    "MG",
  ],
  authors: [{ name: "GTSETTE Soluções Financeiras" }],
  creator: "GTSETTE Soluções Financeiras",
  publisher: "GTSETTE Soluções Financeiras",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "GTSETTE Soluções Financeiras",
    title: "GTSETTE Soluções Financeiras - Limpa Nome e Recuperação de Crédito",
    description:
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 40 mil clientes atendidos.",
    images: [
      {
        url: "/images/logo-gtsette.png",
        width: 1200,
        height: 630,
        alt: "GTSETTE Soluções Financeiras",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTSETTE Soluções Financeiras - Limpa Nome e Recuperação de Crédito",
    description:
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 40 mil clientes atendidos.",
    images: ["/images/logo-gtsette.png"],
    creator: "@gtsette_solucoes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Adicione aqui os códigos de verificação quando disponíveis
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "GTSETTE Soluções Financeiras",
    description:
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 40 mil clientes atendidos.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo-gtsette.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Augusto de Lima, 407 – Loja 11",
      addressLocality: "Belo Horizonte",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-31-98765-4321",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://www.instagram.com/gtsette_solucoes/",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "40000",
    },
    serviceType: [
      "Limpa Nome",
      "Negociação de Dívidas",
      "Aumento de Score",
      "Regularização de CPF",
      "Recuperação de Crédito",
    ],
  }

  return (
    <html lang="pt-BR">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '25487330210944319');
fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=25487330210944319&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
