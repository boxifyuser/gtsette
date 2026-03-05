import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { updateOrgao, deleteOrgao } from "@/lib/admin-orgaos"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { id } = await params
  if (!id) return NextResponse.json({ error: "id obrigatório." }, { status: 400 })
  const body = await request.json().catch(() => ({}))
  const result = await updateOrgao(id, {
    nome: body.nome,
    ordem: body.ordem,
    ativo: body.ativo,
  })
  if (result.error) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { id } = await params
  if (!id) return NextResponse.json({ error: "id obrigatório." }, { status: 400 })
  const result = await deleteOrgao(id)
  if (result.error) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  return NextResponse.json({ success: true })
}
