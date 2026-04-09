import { createHash } from "crypto"
import { META_LEAD_CONTENT_NAME, resolveMetaLeadFormSource, type MetaLeadFormSource } from "@/lib/meta-lead-analytics"

/** SHA-256 hex, e-mail normalizado (minúsculas, trim), conforme Meta. */
export function hashMetaEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex")
}

/** SHA-256 hex, telefone só dígitos com código 55 (BR). */
export function hashMetaPhone(digits: string): string {
  const d = digits.replace(/\D/g, "")
  if (!d) return ""
  const e164 = d.startsWith("55") ? d : `55${d}`
  return createHash("sha256").update(e164).digest("hex")
}

export type SendMetaCapiLeadParams = {
  eventId: string
  eventSourceUrl: string
  source: MetaLeadFormSource | string
  email?: string
  phoneDigits?: string
  valueBRL?: number
  clientIp?: string
  userAgent?: string
}

/**
 * Envia um evento Lead via Conversions API (deduplica com o Pixel usando o mesmo `event_id` / `eventID`).
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api
 */
export async function sendMetaCapiLead(
  pixelId: string,
  accessToken: string,
  params: SendMetaCapiLeadParams
): Promise<{ ok: true } | { ok: false; error: string }> {
  const version = (process.env.META_GRAPH_API_VERSION ?? "v21.0").replace(/\r\n|\r|\n/g, "").trim() || "v21.0"
  const sourceKey = resolveMetaLeadFormSource(params.source)
  const content_name = META_LEAD_CONTENT_NAME[sourceKey]

  const user_data: Record<string, string | string[]> = {}
  if (params.clientIp) user_data.client_ip_address = params.clientIp
  if (params.userAgent) user_data.client_user_agent = params.userAgent

  const emailTrim = params.email?.trim()
  if (emailTrim) user_data.em = [hashMetaEmail(emailTrim)]

  const phoneDigits = params.phoneDigits?.replace(/\D/g, "") ?? ""
  if (phoneDigits) {
    const phHash = hashMetaPhone(phoneDigits)
    if (phHash) user_data.ph = [phHash]
  }

  const custom_data: Record<string, string | number> = {
    content_name,
    content_category: "lead_form",
  }
  if (params.valueBRL != null && params.valueBRL > 0) {
    custom_data.value = params.valueBRL
    custom_data.currency = "BRL"
  }

  const eventPayload = {
    event_name: "Lead" as const,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website" as const,
    event_source_url: params.eventSourceUrl.slice(0, 2000),
    user_data,
    custom_data,
  }

  const url = new URL(`https://graph.facebook.com/${version}/${pixelId}/events`)
  url.searchParams.set("access_token", accessToken)

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [eventPayload] }),
    })
    const json = (await res.json()) as {
      events_received?: number
      error?: { message: string; code?: number }
    }
    if (!res.ok || json.error) {
      return {
        ok: false,
        error: json.error?.message ?? `HTTP ${res.status}`,
      }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" }
  }
}
