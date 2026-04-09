import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { sendMetaCapiLead } from "@/lib/meta-capi"

// BOXIFY_API_BASE_URL e BOXIFY_API_TOKEN devem estar definidos em .env.local

/** Extrai valor numérico de string (ex: "R$ 50.000" -> 50000) */
function parseValue(value: string | undefined): number | undefined {
  if (!value || typeof value !== "string") return undefined
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return undefined
  return parseInt(digits, 10)
}

/** Remove espaços e quebras de linha (comum em .env no Windows) */
function normalizeEnv(value: string | undefined): string {
  if (value == null || typeof value !== "string") return ""
  return value.replace(/\r\n|\r|\n/g, "").trim()
}

const MSG_EMAIL_JA_CADASTRADO =
  "Este e-mail já está cadastrado. Use outro e-mail ou entre em contato pelo WhatsApp."

/** Mensagem de erro retornada pela Boxify / Postgres (formato varia). */
function extractBoxifyErrorText(data: Record<string, unknown>): string {
  const asTrimmed = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim() ? v.trim() : undefined
  return (
    asTrimmed(data.message) ??
    asTrimmed(data.error) ??
    (() => {
      const err = data.error
      if (err && typeof err === "object" && err !== null) {
        return asTrimmed((err as Record<string, unknown>).message)
      }
      return undefined
    })() ??
    asTrimmed(data.detail) ??
    ""
  )
}

/** Evita exibir texto cru do Postgres (ex.: unique constraint) para o usuário final. */
function humanizeLeadCreationError(raw: string): string {
  if (!raw) return "Erro ao cadastrar lead"
  const lower = raw.toLowerCase()
  const isDuplicate = /duplicate key value violates unique constraint/i.test(raw)
  const isEmailUnique =
    lower.includes("idx_crm_leads_org_email_lower_unique") ||
    (isDuplicate && (lower.includes("email") || lower.includes("crm_leads")))
  if (isEmailUnique) return MSG_EMAIL_JA_CADASTRADO
  return raw
}

function eventSourceUrlFromRequest(request: NextRequest): string {
  const referer = request.headers.get("referer")
  if (referer) return referer
  const origin = request.headers.get("origin")
  if (origin) return origin
  const site = normalizeEnv(process.env.NEXT_PUBLIC_SITE_URL)
  return site || "http://localhost"
}

function clientIpFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const first = forwarded?.split(",")[0]?.trim()
  if (first) return first
  return normalizeEnv(request.headers.get("x-real-ip") ?? undefined)
}

export async function POST(request: NextRequest) {
  try {
    const rawBase = process.env.BOXIFY_API_BASE_URL
    const rawToken = process.env.BOXIFY_API_TOKEN
    const boxifyBase = normalizeEnv(rawBase)
    const boxifyToken = normalizeEnv(rawToken)

    if (!boxifyToken) {
      return NextResponse.json(
        { error: "Token inválido ou ausente. Configure BOXIFY_API_TOKEN em .env.local" },
        { status: 503 }
      )
    }
    if (!boxifyBase) {
      return NextResponse.json(
        { error: "URL da API não configurada. Configure BOXIFY_API_BASE_URL em .env.local" },
        { status: 503 }
      )
    }
    const baseUrl = boxifyBase

    const body = await request.json()
    const {
      name,
      email,
      phone,
      document,
      value: valueRaw,
      score,
      custom_fields,
    } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const value = parseValue(valueRaw)

    // Não enviamos pipeline_id nem stage_id — a Boxify usa o pipeline padrão da conta.
    const payload: Record<string, unknown> = {
      name: name.trim(),
    }
    if (email && String(email).trim()) payload.email = String(email).trim()
    if (phone && String(phone).trim()) payload.phone = String(phone).trim()
    if (document && String(document).trim()) payload.document = String(document).trim().replace(/\D/g, "")
    if (value !== undefined) payload.value = value
    if (score !== undefined && Number.isFinite(Number(score))) payload.score = Math.min(100, Math.max(0, Number(score)))
    const source = body.source
    const baseCustom =
      custom_fields && typeof custom_fields === "object" && !Array.isArray(custom_fields) ? custom_fields : {}
    if (source && typeof source === "string" && source.trim()) {
      payload.custom_fields = { ...baseCustom, origem: source.trim() }
    } else if (Object.keys(baseCustom).length > 0) {
      payload.custom_fields = baseCustom
    }

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/leads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${boxifyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      const rawMsg = extractBoxifyErrorText(data) || "Erro ao cadastrar lead"
      const isTokenError = /token|authorization|bearer/i.test(rawMsg)
      const msg = isTokenError ? rawMsg : humanizeLeadCreationError(rawMsg)
      return NextResponse.json(
        {
          error: isTokenError
            ? "Token da Boxify rejeitado. Pegue um token válido em Configurações > API no painel da Boxify, coloque em BOXIFY_API_TOKEN no .env.local (use https:// na URL) e reinicie o servidor (npm run dev)."
            : msg,
          details: isTokenError ? undefined : data,
        },
        { status: res.status }
      )
    }

    const pixelId = "25487330210944319"
    const capiToken = normalizeEnv(process.env.FACEBOOK_CAPI_ACCESS_TOKEN)
    let metaLeadEventId: string | undefined

    if (pixelId && capiToken) {
      metaLeadEventId = randomUUID()
      const capi = await sendMetaCapiLead(pixelId, capiToken, {
        eventId: metaLeadEventId,
        eventSourceUrl: eventSourceUrlFromRequest(request),
        source: typeof source === "string" ? source : "home",
        email: email && String(email).trim() ? String(email).trim() : undefined,
        phoneDigits: phone && String(phone).trim() ? String(phone).replace(/\D/g, "") : undefined,
        valueBRL: value,
        clientIp: clientIpFromRequest(request) || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      })
      if (!capi.ok) {
        console.warn("[api/leads] Meta CAPI Lead:", capi.error)
        metaLeadEventId = undefined
      }
    }

    return NextResponse.json({
      success: true,
      data,
      ...(metaLeadEventId ? { metaLeadEventId } : {}),
    })
  } catch (err) {
    console.error("[api/leads]", err)
    return NextResponse.json(
      { error: "Erro interno ao cadastrar lead" },
      { status: 500 }
    )
  }
}
