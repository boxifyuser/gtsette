/**
 * Normaliza número para wa.me (somente dígitos, com DDI 55 se for BR 10/11 dígitos).
 */
export function normalizeWhatsappPhone(input: string | null | undefined): string | null {
  if (input == null) return null
  const digits = String(input).replace(/\D/g, "")
  if (digits.length < 10) return null
  if (digits.length === 11 && digits.startsWith("0")) return null
  // BR sem DDI: 11 dígitos (cel) ou 10 (fixo) → prefixar 55
  if (digits.length === 11 || digits.length === 10) {
    if (!digits.startsWith("55")) return `55${digits}`
  }
  return digits
}

/** Monta URL wa.me com texto (abre WhatsApp Web/App para enviar). */
export function buildWhatsappSendUrl(phoneDigits: string, text: string): string {
  const phone = phoneDigits.replace(/\D/g, "")
  const encoded = encodeURIComponent(text)
  return `https://wa.me/${phone}?text=${encoded}`
}

/**
 * Envia mensagem via Twilio WhatsApp (opcional).
 * Requer TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (ex.: whatsapp:+14155238886).
 */
export async function sendWhatsappViaTwilio(
  toPhoneDigits: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim()
  const token = process.env.TWILIO_AUTH_TOKEN?.trim()
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim()
  if (!sid || !token || !from) return { ok: false, error: "Twilio não configurado." }
  const to = normalizeWhatsappPhone(toPhoneDigits)
  if (!to) return { ok: false, error: "Número inválido." }
  const toWhatsapp = to.startsWith("whatsapp:") ? to : `whatsapp:+${to}`
  const auth = Buffer.from(`${sid}:${token}`).toString("base64")
  const params = new URLSearchParams()
  params.set("From", from.startsWith("whatsapp:") ? from : `whatsapp:+${from.replace(/\D/g, "")}`)
  params.set("To", toWhatsapp.startsWith("whatsapp:") ? toWhatsapp : `whatsapp:+${to}`)
  params.set("Body", body)
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
    if (res.ok) return { ok: true }
    const errText = await res.text()
    return { ok: false, error: errText.slice(0, 200) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha na requisição." }
  }
}
