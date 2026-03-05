import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { listUsersWithCadastroFiltered, bulkCreateLeads, bulkDeleteUsers, type LeadRow } from "@/lib/admin-users"

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const q = request.nextUrl.searchParams.get("q") ?? ""
  const users = await listUsersWithCadastroFiltered(q)
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 })
  }
  if (!Array.isArray(body) || body.length === 0) {
    return NextResponse.json({ error: "Envie um array de leads (nome_completo, cpf, email, cnpj)." }, { status: 400 })
  }
  const rows: LeadRow[] = body.map((r: unknown) => {
    const o = r as Record<string, unknown>
    return {
      nome_completo: String(o?.nome_completo ?? ""),
      cpf: String(o?.cpf ?? ""),
      email: String(o?.email ?? ""),
      cnpj: o?.cnpj != null ? String(o.cnpj) : null,
      tipo_processo: o?.tipo_processo != null ? String(o.tipo_processo) : null,
      status_processo: o?.status_processo != null ? String(o.status_processo) : null,
      observacoes: o?.observacoes != null ? String(o.observacoes) : null,
      data_atualizacao: o?.data_atualizacao != null ? String(o.data_atualizacao) : null,
      data_conclusao: o?.data_conclusao != null ? String(o.data_conclusao) : null,
      situacao_por_orgao: o?.situacao_por_orgao != null ? String(o.situacao_por_orgao) : null,
    }
  })
  const result = await bulkCreateLeads(rows)
  return NextResponse.json({ created: result.created, errors: result.errors })
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 })
  }
  const ids = Array.isArray((body as { ids?: unknown }).ids)
    ? ((body as { ids: unknown[] }).ids.filter((id): id is string => typeof id === "string"))
    : []
  if (ids.length === 0) {
    return NextResponse.json({ error: "Envie um array de ids (ids: string[])." }, { status: 400 })
  }
  const result = await bulkDeleteUsers(ids)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ deleted: result.deleted })
}
