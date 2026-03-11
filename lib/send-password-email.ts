import { getUserById } from "@/lib/auth-neon"
import { getCadastroByUserId } from "@/lib/cadastro"
import { sendPasswordEmailResend } from "@/lib/resend-password-email"

/**
 * Envia senha temporária por e-mail (Resend).
 * Usa o template password-reset-notification quando possível; fallback HTML inline.
 */
export async function sendTemporaryPasswordEmail(
  userId: string,
  temporaryPassword: string
): Promise<{ ok: boolean; email?: string }> {
  const user = await getUserById(userId)
  if (!user) return { ok: false }
  const cadastro = await getCadastroByUserId(userId)
  const email = cadastro?.email?.trim()
  const resendKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev"
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(
    /\/$/,
    ""
  )
  const loginUrl = siteUrl ? `${siteUrl}/minha-conta` : ""

  if (!resendKey || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, email: email || undefined }
  }

  // URL absoluta obrigatória para RESET_LINK no template Resend
  const loginUrlAbsolute =
    loginUrl.startsWith("http") ? loginUrl : siteUrl ? `${siteUrl}/minha-conta` : ""

  const ok = await sendPasswordEmailResend({
    resendKey,
    from,
    to: email,
    username: user.username,
    temporaryPassword,
    loginUrl: loginUrlAbsolute || loginUrl || "/minha-conta",
  })

  if (ok) return { ok: true, email }
  return { ok: false, email }
}
