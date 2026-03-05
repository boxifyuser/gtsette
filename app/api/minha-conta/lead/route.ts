import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { normalizeEnv, getBoxifyBaseUrl, fetchBoxifyLeads } from "@/lib/boxify"
import { getProcessosByUserId } from "@/lib/admin-processos"

const PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

function normalizeDocument(value: string): string {
  return value.replace(/\D/g, "").replace(/^0+/, "") || value
}

function getLeadDocument(lead: Record<string, unknown>): string | null {
  const v = lead.document ?? lead.document_number ?? lead.doc ?? lead.cpf ?? lead.cnpj
  if (v != null && typeof v === "string" && v.trim()) {
    const n = normalizeDocument(v.trim())
    if (n.length === 11 || n.length === 14) return n
  }
  if (v != null && typeof v === "number" && !Number.isNaN(v)) {
    const n = String(v).replace(/\D/g, "").replace(/^0+/, "")
    if (n.length === 11 || n.length === 14) return n
  }
  return null
}

/** Converte processo (user_processos) para formato lead-like para exibição na página. */
function processoToLeadLike(p: { id: string; tipo_processo: string | null; status_processo: string | null; observacoes: string | null; data_atualizacao: string | null; data_conclusao: string | null; situacao_por_orgao: Record<string, string> | null; created_at: Date; updated_at: Date }): Record<string, unknown> {
  return {
    id: p.id,
    custom_fields: {
      tipodeprocesso: p.tipo_processo,
      statusdoprocesso: p.status_processo,
      observacoes: p.observacoes,
      datadaatualizacao: p.data_atualizacao,
      datadeconclusao: p.data_conclusao,
    },
    situacao_por_orgao: p.situacao_por_orgao ?? {},
    created_at: p.created_at,
    updated_at: p.updated_at,
  }
}

/**
 * GET /api/minha-conta/lead
 * Retorna todos os leads/processos do usuário.
 * - Neon (userId + username): processos da tabela user_processos.
 * - Boxify (document): leads da API Boxify filtrados pelo documento.
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ leads: null }, { status: 401 })
    }

    if (session.userId && session.username) {
      const processos = await getProcessosByUserId(session.userId)
      const leads = processos.map(processoToLeadLike)
      return NextResponse.json({ leads })
    }

    const doc = session.document
    if (!doc) {
      return NextResponse.json({ leads: [] })
    }

    const token = normalizeEnv(process.env.BOXIFY_API_TOKEN)
    if (!token) {
      return NextResponse.json({ leads: null }, { status: 503 })
    }

    const baseUrl = getBoxifyBaseUrl()
    const result = await fetchBoxifyLeads(baseUrl, token, PIPELINE_ID, 500)

    if (!result.ok) {
      return NextResponse.json({ leads: null }, { status: 502 })
    }

    const leads = result.leads
    const docNormalized = normalizeDocument(doc)
    const matchedLeads = leads.filter((l) => {
      const leadDoc = getLeadDocument(l)
      return leadDoc && leadDoc === docNormalized
    })

    return NextResponse.json({ leads: matchedLeads })
  } catch (e) {
    console.error("[minha-conta/lead]", e)
    return NextResponse.json({ leads: null }, { status: 500 })
  }
}
