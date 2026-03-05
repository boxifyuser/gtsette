import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { getProcessoById, updateProcesso, deleteProcesso } from "@/lib/admin-processos"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { id } = await params
  if (!id) return NextResponse.json({ error: "id obrigatório." }, { status: 400 })
  const body = await request.json()
  const result = await updateProcesso(id, {
    tipo_processo: body.tipo_processo,
    status_processo: body.status_processo,
    observacoes: body.observacoes,
    data_atualizacao: body.data_atualizacao,
    data_conclusao: body.data_conclusao,
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
  const existing = await getProcessoById(id)
  if (!existing) return NextResponse.json({ error: "Processo não encontrado." }, { status: 404 })
  const result = await deleteProcesso(id)
  if (result.error) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  return NextResponse.json({ success: true })
}
