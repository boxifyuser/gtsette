import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"

/**
 * GET /api/health/resend
 * Verifica se RESEND_API_KEY está configurada e aceita pela API Resend
 * (GET /domains — não envia e-mail).
 *
 * - Em desenvolvimento: acesso livre.
 * - Em produção: exige sessão admin (evita expor status publicamente).
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado. Faça login no admin ou teste em desenvolvimento." },
        { status: 401 }
      )
    }
  }

  const resendKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim() || "(não definido — fallback onboarding@resend.dev)"

  if (!resendKey) {
    return NextResponse.json({
      ok: false,
      connected: false,
      error: "RESEND_API_KEY não está definida no ambiente.",
      fromConfigured: Boolean(process.env.RESEND_FROM?.trim()),
      from,
    })
  }

  try {
    const res = await fetch("https://api.resend.com/domains", {
      method: "GET",
      headers: { Authorization: `Bearer ${resendKey}` },
      cache: "no-store",
    })

    const text = await res.text()
    let body: unknown
    try {
      body = JSON.parse(text) as { data?: unknown[]; message?: string; name?: string }
    } catch {
      body = { raw: text.slice(0, 200) }
    }

    if (!res.ok) {
      const errObj = body as { message?: string; name?: string }
      return NextResponse.json({
        ok: false,
        connected: false,
        status: res.status,
        error: errObj.message || errObj.name || `Resend retornou HTTP ${res.status}`,
        fromConfigured: Boolean(process.env.RESEND_FROM?.trim()),
        from,
      })
    }

    const list = body as { data?: unknown[] }
    const domainCount = Array.isArray(list.data) ? list.data.length : 0

    return NextResponse.json({
      ok: true,
      connected: true,
      message: "Conexão com a API Resend OK.",
      domainsListed: domainCount,
      fromConfigured: Boolean(process.env.RESEND_FROM?.trim()),
      from,
      hint:
        domainCount === 0 && !process.env.RESEND_FROM?.trim()
          ? "Adicione um domínio na Resend e defina RESEND_FROM com remetente verificado para envio em produção."
          : undefined,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro de rede"
    return NextResponse.json({
      ok: false,
      connected: false,
      error: msg,
      fromConfigured: Boolean(process.env.RESEND_FROM?.trim()),
      from,
    })
  }
}
