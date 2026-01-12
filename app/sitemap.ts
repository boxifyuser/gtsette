import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/como-funciona",
    "/servicos",
    "/blog",
    "/sobre",
    "/contato",
    "/consulta",
    "/consulta/sucesso",
    "/minha-conta",
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/consulta" ? 0.9 : route === "/servicos" ? 0.8 : 0.7,
  }))
}