import { NextResponse } from "next/server"
import { getOrgaos } from "@/lib/admin-orgaos"

/** GET: lista órgãos ativos (público, para Minha Conta exibir situação por órgão). */
export async function GET() {
  const orgaos = await getOrgaos(true)
  return NextResponse.json({ orgaos })
}
