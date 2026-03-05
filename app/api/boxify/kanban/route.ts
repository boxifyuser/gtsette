import { NextRequest, NextResponse } from "next/server"
import { normalizeEnv, getBoxifyBaseUrl, fetchBoxifyLeads } from "@/lib/boxify"

const PIPELINE_ID = "9abf49fa-1b05-4be7-8ec5-76646e4df53d"

/**
 * GET /api/boxify/kanban
 * Busca leads via Boxify (GET ou POST /api/v1/leads conforme suporte da API).
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

    const baseUrl = getBoxifyBaseUrl()
    const result = await fetchBoxifyLeads(baseUrl, token, pipelineId, limit)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "Falha ao buscar leads no Boxify.",
          status: result.status,
          details: result.status === 401 ? "Token inválido." : result.statusText,
        },
        { status: result.status === 401 ? 401 : 502 }
      )
    }

    return NextResponse.json({ leads: result.leads })
  } catch (e) {
    console.error("[boxify/kanban]", e)
    return NextResponse.json(
      { error: "Erro ao comunicar com o Boxify." },
      { status: 500 }
    )
  }
}
