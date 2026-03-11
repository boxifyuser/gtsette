import { NextRequest, NextResponse } from "next/server"

// BOXIFY_API_BASE_URL e BOXIFY_API_TOKEN devem estar definidos em .env.local

/** Pipeline usado no site (leads do formulário hero). Pode ser sobrescrito por BOXIFY_PIPELINE_ID. */
const DEFAULT_PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

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
      status: statusRaw,
      score,
      pipeline_id,
      stage_id,
      custom_fields,
    } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const value = parseValue(valueRaw)
    const statusList = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const
    const status = statusList.includes(statusRaw) ? statusRaw : "new"

    // Body conforme doc Boxify: POST .../leads (pipeline_id costuma ser obrigatório para criar lead)
    const pipelineId =
      (pipeline_id && String(pipeline_id).trim()) ||
      normalizeEnv(process.env.BOXIFY_PIPELINE_ID) ||
      DEFAULT_PIPELINE_ID

    const payload: Record<string, unknown> = {
      name: name.trim(),
      status,
      pipeline_id: pipelineId,
    }
    if (email && String(email).trim()) payload.email = String(email).trim()
    if (phone && String(phone).trim()) payload.phone = String(phone).trim()
    if (document && String(document).trim()) payload.document = String(document).trim().replace(/\D/g, "")
    if (value !== undefined) payload.value = value
    if (score !== undefined && Number.isFinite(Number(score))) payload.score = Math.min(100, Math.max(0, Number(score)))
    if (stage_id && String(stage_id).trim()) payload.stage_id = String(stage_id).trim()
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

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = data?.message ?? data?.error ?? "Erro ao cadastrar lead"
      const isTokenError = typeof msg === "string" && /token|authorization|bearer/i.test(msg)
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

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("[api/leads]", err)
    return NextResponse.json(
      { error: "Erro interno ao cadastrar lead" },
      { status: 500 }
    )
  }
}
