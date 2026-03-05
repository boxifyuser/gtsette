import { NextRequest, NextResponse } from "next/server"

const BOXIFY_API_V1 = "https://boxify.com.br/api/v1"
const PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

function normalizeEnv(value: string | undefined): string {
  if (value == null || typeof value !== "string") return ""
  return value.replace(/\r\n|\r|\n/g, "").trim()
}

/**
 * GET /api/boxify/kanban
 * Busca leads via Boxify GET /api/v1/leads (mesmo token do formulário).
 * Query: pipeline_id (opcional), limit (1–500, padrão 100).
 */
export async function GET(request: NextRequest) {
  try {
    const token = normalizeEnv(process.env.BOXIFY_API_TOKEN)
    if (!token) {
      return NextResponse.json(
        { error: "BOXIFY_API_TOKEN não configurado." },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const pipelineId = searchParams.get("pipeline_id") || searchParams.get("pipelineId") || PIPELINE_ID
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10) || 100))

    const params = new URLSearchParams()
    params.set("pipeline_id", pipelineId)
    params.set("limit", String(limit))

    const url = `${BOXIFY_API_V1}/leads?${params.toString()}`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        {
          error: "Falha ao buscar leads no Boxify.",
          status: res.status,
          details: res.status === 401 ? "Token inválido." : text.slice(0, 200),
        },
        { status: res.status === 401 ? 401 : 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error("[boxify/kanban]", e)
    return NextResponse.json(
      { error: "Erro ao comunicar com o Boxify." },
      { status: 500 }
    )
  }
}
