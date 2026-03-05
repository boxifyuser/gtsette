import { redirect } from "next/navigation"

/**
 * Rota /minha-conta/lead não existe como página.
 * Redireciona para /minha-conta (os dados vêm da API GET /api/minha-conta/lead).
 */
export default function MinhaContaLeadPage() {
  redirect("/minha-conta")
}
