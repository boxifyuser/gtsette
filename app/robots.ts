import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/minha-conta"],
      },
    ],
    ...(siteUrl && { sitemap: `${siteUrl}/sitemap.xml` }),
  }
}