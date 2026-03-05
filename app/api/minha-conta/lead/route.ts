import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

const BOXIFY_API_V1 = "https://boxify.com.br/api/v1"
const PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

function normalizeEnv(value: string | undefined): string {
  if (value == null || typeof value !== "string") return ""
  return value.replace(/\r\n|\r|\n/g, "").trim()
}

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

/**
 * GET /api/minha-conta/lead
 * Retorna o lead da sessão (document + custom_fields.datadenascimento).
 * Usa GET /api/v1/leads da Boxify e encontra o lead pelo document.
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ lead: null }, { status: 401 })
    }

    const token = normalizeEnv(process.env.BOXIFY_API_TOKEN)
    if (!token) {
      return NextResponse.json({ lead: null }, { status: 503 })
    }

    const baseUrl = normalizeEnv(process.env.BOXIFY_API_BASE_URL)?.replace(/\/$/, "") || BOXIFY_API_V1
    const url = `${baseUrl}/leads?pipeline_id=${encodeURIComponent(PIPELINE_ID)}&limit=500`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({ lead: null }, { status: 502 })
    }

    const data = await res.json()
    const leads: Array<Record<string, unknown>> = Array.isArray(data?.leads) ? data.leads : []
    const docNormalized = normalizeDocument(session.document)
    const lead = leads.find((l) => {
      const leadDoc = getLeadDocument(l)
      return leadDoc && leadDoc === docNormalized
    })

    if (!lead) {
      return NextResponse.json({ lead: null }, { status: 404 })
    }

    return NextResponse.json({ lead })
  } catch (e) {
    console.error("[minha-conta/lead]", e)
    return NextResponse.json({ lead: null }, { status: 500 })
  }
}
