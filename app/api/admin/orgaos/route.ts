import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { getOrgaos, createOrgao, seedDefaultOrgaos } from "@/lib/admin-orgaos"

/** GET: lista todos os órgãos (admin). */
export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const orgaos = await getOrgaos(false)
  return NextResponse.json({ orgaos })
}

/** POST: cria órgão ou faz seed dos padrão. body: { nome, ordem?, ativo? } ou { seed: true } */
export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  if (body.seed === true) {
    await seedDefaultOrgaos()
    const orgaos = await getOrgaos(false)
    return NextResponse.json({ success: true, orgaos })
  }
  const result = await createOrgao({
    nome: body.nome,
    ordem: body.ordem,
    ativo: body.ativo,
  })
  if ("error" in result) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, id: result.id })
}
