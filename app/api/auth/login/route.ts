import { NextRequest, NextResponse } from "next/server"
import {
  createSessionPayload,
  setSessionCookie,
  getSession,
} from "@/lib/session"

const BOXIFY_API_V1 = "https://boxify.com.br/api/v1"
const PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

function normalizeEnv(value: string | undefined): string {
  if (value == null || typeof value !== "string") return ""
  return value.replace(/\r\n|\r|\n/g, "").trim()
}

function normalizeDocument(value: string): string {
  return value.replace(/\D/g, "")
}

/** Extrai o documento do lead (API Boxify: document) */
function getLeadDocument(lead: Record<string, unknown>): string | null {
  const v = lead.document ?? lead.document_number ?? lead.doc ?? lead.cpf ?? lead.cnpj
  if (v != null && typeof v === "string" && v.trim()) {
    const normalized = normalizeDocument(v.trim())
    const cleaned = normalized.replace(/^0+/, "") || normalized
    if (cleaned.length === 11 || cleaned.length === 14) return cleaned
  }
  if (v != null && typeof v === "number" && !Number.isNaN(v)) {
    const normalized = String(v).replace(/\D/g, "").replace(/^0+/, "") || String(v)
    if (normalized.length === 11 || normalized.length === 14) return normalized
  }
  return null
}

/** Extrai a data de nascimento do lead (API Boxify: custom_fields.datadenascimento em YYYY-MM-DD) */
function getLeadBirthDate(lead: Record<string, unknown>): string | null {
  let custom = lead.custom_fields
  if (typeof custom === "string") {
    try {
      custom = JSON.parse(custom) as Record<string, unknown>
    } catch {
      return null
    }
  }
  if (custom && typeof custom === "object" && !Array.isArray(custom)) {
    const v = (custom as Record<string, unknown>).datadenascimento
    if (v != null && typeof v === "string" && v.trim()) return v.trim().slice(0, 10)
  }
  return null
}

/** Converte DD/MM/AAAA para YYYY-MM-DD para comparar com a API */
function birthDateToApiFormat(ddMmYyyy: string): string {
  const n = ddMmYyyy.replace(/\D/g, "")
  if (n.length !== 8) return ""
  const day = n.slice(0, 2)
  const month = n.slice(2, 4)
  const year = n.slice(4, 8)
  return `${year}-${month}-${day}`
}

/** Retorna a URL base da API Boxify (env ou padrão) */
function getBoxifyBaseUrl(): string {
  const base = normalizeEnv(process.env.BOXIFY_API_BASE_URL)
  if (base) return base.replace(/\/$/, "")
  return BOXIFY_API_V1
}

function validCPF(doc: string): boolean {
  if (doc.length !== 11) return false
  if (/^(\d)\1+$/.test(doc)) return false
  let sum = 0
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(doc[i - 1], 10) * (11 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(doc[9], 10)) return false
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(doc[i - 1], 10) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(doc[10], 10)) return false
  return true
}

function validCNPJ(doc: string): boolean {
  if (doc.length !== 14) return false
  if (/^(\d)\1+$/.test(doc)) return false
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(doc[i], 10) * weights1[i]
  let remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder
  if (remainder !== parseInt(doc[12], 10)) return false
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(doc[i], 10) * weights2[i]
  remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder
  if (remainder !== parseInt(doc[13], 10)) return false
  return true
}

function validDocument(doc: string): boolean {
  const n = normalizeDocument(doc)
  if (n.length === 11) return validCPF(n)
  if (n.length === 14) return validCNPJ(n)
  return false
}

function validBirthDate(value: string): boolean {
  const n = value.replace(/\D/g, "")
  if (n.length !== 8) return false
  const day = parseInt(n.slice(0, 2), 10)
  const month = parseInt(n.slice(2, 4), 10)
  const year = parseInt(n.slice(4, 8), 10)
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > new Date().getFullYear()) return false
  return true
}

/**
 * POST /api/auth/login
 * Body: { document: string (CPF ou CNPJ), birthDate: string (DD/MM/AAAA) }
 * Valida contra GET /api/v1/leads (Boxify) com pipeline_id fixo.
 * Lead: document, custom_fields.datadenascimento (YYYY-MM-DD).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const document = typeof body.document === "string" ? body.document.trim() : ""
    const birthDate = typeof body.birthDate === "string" ? body.birthDate.trim() : ""

    if (!document || !birthDate) {
      return NextResponse.json(
        { success: false, error: "CPF/CNPJ e data de nascimento são obrigatórios." },
        { status: 400 }
      )
    }

    const docNormalized = normalizeDocument(document)
    if (!validDocument(document)) {
      return NextResponse.json(
        { success: false, error: "CPF ou CNPJ inválido." },
        { status: 400 }
      )
    }

    if (!validBirthDate(birthDate)) {
      return NextResponse.json(
        { success: false, error: "Data de nascimento inválida. Use DD/MM/AAAA." },
        { status: 400 }
      )
    }

    // Mesmo token usado no formulário de leads (envio para Boxify)
    const token = normalizeEnv(process.env.BOXIFY_API_TOKEN)
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Serviço temporariamente indisponível. Tente mais tarde." },
        { status: 503 }
      )
    }

    const baseUrl = getBoxifyBaseUrl()
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
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth/login] Boxify GET /leads falhou.", { status: res.status, statusText: res.statusText, url })
      }
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json(
          { success: false, error: "Usuário não está cadastrado com esse CPF e Data de Nascimento. Favor falar no SAC: +55 31 98250-6478" },
          { status: 200 }
        )
      }
      return NextResponse.json(
        { success: false, error: "Usuário não está cadastrado com esse CPF e Data de Nascimento. Favor falar no SAC: +55 31 98250-6478" },
        { status: 200 }
      )
    }

    const data = await res.json()
    const leads: Array<Record<string, unknown>> =
      Array.isArray(data?.leads) ? data.leads : Array.isArray(data?.data?.leads) ? data.data.leads : []
    const birthDateApi = birthDateToApiFormat(birthDate)
    const docNormalizedClean = docNormalized.replace(/^0+/, "") || docNormalized
    const match = leads.find((lead) => {
      const leadDoc = getLeadDocument(lead)
      if (!leadDoc) return false
      const docMatch = leadDoc === docNormalizedClean
      if (!docMatch) return false
      const leadBirth = getLeadBirthDate(lead)
      if (!leadBirth) return true
      return leadBirth === birthDateApi || leadBirth.slice(0, 10) === birthDateApi
    })

    if (!match) {
      if (process.env.NODE_ENV === "development") {
        const firstDoc = leads[0] ? getLeadDocument(leads[0]) : null
        const firstBirth = leads[0] ? getLeadBirthDate(leads[0]) : null
        console.warn("[auth/login] Nenhum lead correspondeu.", {
          leadsCount: leads.length,
          docNormalized,
          birthDateApi,
          firstLeadDoc: firstDoc ?? "(vazio)",
          firstLeadBirth: firstBirth ?? "(vazio)",
        })
      }
      return NextResponse.json(
        { success: false, error: "Usuário não está cadastrado com esse CPF e Data de Nascimento. Favor falar no SAC: +55 31 98250-6478" },
        { status: 200 }
      )
    }

    const payload = createSessionPayload(document, birthDate)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar sessão. Configure BOXIFY_SESSION_SECRET no servidor." },
        { status: 503 }
      )
    }

    await setSessionCookie(payload)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[auth/login]", e)
    return NextResponse.json(
      { success: false, error: "Erro ao processar login." },
      { status: 500 }
    )
  }
}
