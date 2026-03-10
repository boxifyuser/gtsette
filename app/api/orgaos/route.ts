import { NextResponse } from "next/server"
import { getOrgaos } from "@/lib/admin-orgaos"

/** GET: lista órgãos ativos (público, para Minha Conta exibir situação por órgão). */
export async function GET() {
  const orgaos = (await getOrgaos(true)).filter((o) => o.nome.trim() !== "Outros")
  return NextResponse.json({ orgaos })
}
