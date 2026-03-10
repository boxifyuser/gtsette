/**
 * Helper para listar leads na API Boxify.
 * A API pode retornar 405 Method Not Allowed para GET /leads; neste caso
 * tentamos POST /leads com body { pipeline_id, limit } (padrão em algumas APIs).
 * Requer BOXIFY_API_BASE_URL configurado no ambiente.
 */

export function normalizeEnv(value: string | undefined): string {
  if (value == null || typeof value !== "string") return ""
  return value.replace(/\r\n|\r|\n/g, "").trim()
}

export function getBoxifyBaseUrl(): string {
  const base = normalizeEnv(process.env.BOXIFY_API_BASE_URL)
  return base ? base.replace(/\/$/, "") : ""
}

export type FetchLeadsResult =
  | { ok: true; leads: Array<Record<string, unknown>> }
  | { ok: false; status: number; statusText: string }

/**
 * Lista leads do pipeline na Boxify.
 * Tenta GET /leads?pipeline_id=...&limit=...; se retornar 405, tenta POST /leads com body.
 */
export async function fetchBoxifyLeads(
  baseUrl: string,
  token: string,
  pipelineId: string,
  limit: number = 500
): Promise<FetchLeadsResult> {
  const url = `${baseUrl}/leads`
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  // 1) Tentar GET (query string)
  const getUrl = `${url}?pipeline_id=${encodeURIComponent(pipelineId)}&limit=${limit}`
  const getRes = await fetch(getUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  })

  if (getRes.ok) {
    const data = await getRes.json()
    const leads = Array.isArray(data?.leads) ? data.leads : Array.isArray(data?.data?.leads) ? data.data.leads : []
    return { ok: true, leads }
  }

  // 2) Se 405 Method Not Allowed, tentar POST com body (listar/buscar)
  if (getRes.status === 405) {
    const postRes = await fetch(url, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({
        pipeline_id: pipelineId,
        limit,
      }),
    })

    if (postRes.ok) {
      const data = await postRes.json()
      const leads = Array.isArray(data?.leads) ? data.leads : Array.isArray(data?.data?.leads) ? data.data.leads : []
      return { ok: true, leads }
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("[boxify] POST /leads (listar) falhou.", {
        status: postRes.status,
        statusText: postRes.statusText,
        url,
      })
    }

    // 3) Tentar GET /pipelines/:id/leads (padrão REST alternativo)
    const pipelineUrl = `${baseUrl}/pipelines/${encodeURIComponent(pipelineId)}/leads?limit=${limit}`
    const pipelineRes = await fetch(pipelineUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (pipelineRes.ok) {
      const data = await pipelineRes.json()
      const leads = Array.isArray(data?.leads) ? data.leads : Array.isArray(data?.data?.leads) ? data.data.leads : []
      return { ok: true, leads }
    }

    return { ok: false, status: postRes.status, statusText: postRes.statusText }
  }

  return { ok: false, status: getRes.status, statusText: getRes.statusText }
}
