import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { getProcessosByUserId, createProcesso, bulkUpsertProcessos } from "@/lib/admin-processos"
import { listUsersWithCadastro } from "@/lib/admin-users"

async function ensureUserExists(userId: string): Promise<boolean> {
  const users = await listUsersWithCadastro()
  return users.some((u) => u.id === userId)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { userId } = await params
  if (!userId) return NextResponse.json({ error: "userId obrigatório." }, { status: 400 })
  const exists = await ensureUserExists(userId)
  if (!exists) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
  const processos = await getProcessosByUserId(userId)
  return NextResponse.json({ processos })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { userId } = await params
  if (!userId) return NextResponse.json({ error: "userId obrigatório." }, { status: 400 })
  const exists = await ensureUserExists(userId)
  if (!exists) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })

  const body = await request.json()

  if (Array.isArray(body.items)) {
    const result = await bulkUpsertProcessos(userId, body.items)
    if (result.error) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, created: result.created, updated: result.updated })
  }

  const result = await createProcesso(userId, {
    tipo_processo: body.tipo_processo,
    status_processo: body.status_processo,
    observacoes: body.observacoes,
    data_atualizacao: body.data_atualizacao,
    data_conclusao: body.data_conclusao,
  })
  if ("error" in result) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, id: result.id })
}
