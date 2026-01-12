import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GTSETTE Soluções Financeiras",
    short_name: "GTSETTE",
    description: "Especialistas em Limpa Nome, regularização de CPF, aumento de Score e negociação de dívidas",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366F4",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}