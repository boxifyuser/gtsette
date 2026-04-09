import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BoxifyChatFloating } from "@/components/boxify-chat-floating"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: {
    default: "GTSETTE Soluções Financeiras - Limpa Nome e Recuperação de Crédito",
    template: "%s | GTSETTE Soluções Financeiras",
  },
  description:
    "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 80 mil clientes que limparam nome conosco. Ética, transparência e resultados reais.",
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
    ...(siteUrl && { url: siteUrl }),
    siteName: "GTSETTE Soluções Financeiras",
    title: "GTSETTE Soluções Financeiras - Limpa Nome e Recuperação de Crédito",
    description:
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 80 mil clientes que limparam nome conosco.",
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
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 80 mil clientes que limparam nome conosco.",
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
  ...(siteUrl && { alternates: { canonical: siteUrl } }),
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
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? ""
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? ""
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "GTSETTE Soluções Financeiras",
    description:
      "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas. Mais de 80 mil clientes que limparam nome conosco.",
    ...(siteUrl && { url: siteUrl }),
    ...(siteUrl && { logo: `${siteUrl}/images/logo-gtsette.png` }),
    ...(contactAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: contactAddress,
        addressCountry: "BR",
      },
    }),
    ...(contactPhone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactPhone,
        contactType: "customer service",
        areaServed: "BR",
        availableLanguage: "Portuguese",
      },
    }),
    ...(instagramUrl && { sameAs: [instagramUrl] }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "80000",
    },
    serviceType: [
      "Limpa Nome",
      "Retirada de Dívidas dos Órgãos",
      "Restauração de Score",
      "Regularização de CPF",
      "Recuperação de Crédito",
    ],
  }

  return (
    <html lang="pt-BR">
      <head>
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Chat flutuante dentro do site: ao clicar no botão abre painel no canto inferior direito, sem nova aba */}
        <BoxifyChatFloating />
        <Analytics />
      </body>
    </html>
  )
}
