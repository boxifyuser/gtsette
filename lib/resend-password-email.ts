/**
 * Envio de e-mail de senha temporária via Resend.
 * Prioriza o template oficial password-reset-notification; se falhar, usa HTML inline.
 *
 * Template Resend: https://resend.com/templates → password-reset-notification
 * Variáveis comuns nesse template (ajuste no dashboard se necessário):
 *   RESET_LINK — URL do botão (use URL absoluta da Minha Conta)
 *   USER_NAME — opcional
 * Se você duplicar o template e adicionar {{{ TEMPORARY_PASSWORD }}}, passe no variables abaixo.
 */

const RESEND_API = "https://api.resend.com/emails"

/** ID do template no dashboard Resend (slug ou UUID publicado). */
export const RESEND_PASSWORD_RESET_TEMPLATE_ID =
  process.env.RESEND_PASSWORD_RESET_TEMPLATE_ID?.trim() || "password-reset-notification"

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildFallbackHtml(params: {
  username: string
  temporaryPassword: string
  loginUrl: string
}): string {
  const u = escapeHtml(params.username)
  const p = escapeHtml(params.temporaryPassword)
  const url = escapeHtml(params.loginUrl)
  return `<p>Olá,</p>
<p>Foi definida uma nova senha para acesso à área do cliente GTSETTE.</p>
<p><strong>Usuário:</strong> ${u}<br/>
<strong>Senha temporária:</strong> ${p}</p>
<p>Acesse: <a href="${url}">${url}</a></p>
<p>Você pode entrar com e-mail ou telefone cadastrados + esta senha.</p>
<p>Recomendamos alterar a senha após o primeiro acesso.</p>`
}

export interface SendPasswordEmailParams {
  resendKey: string
  from: string
  to: string
  subject?: string
  username: string
  temporaryPassword: string
  /** URL absoluta recomendada (ex.: https://site.com/minha-conta) */
  loginUrl: string
}

/**
 * Envia e-mail. Tenta template password-reset-notification; em caso de erro da API, envia HTML inline.
 */
export async function sendPasswordEmailResend(params: SendPasswordEmailParams): Promise<boolean> {
  const subject =
    params.subject?.trim() || "Recuperação de senha — área do cliente GTSETTE"
  const loginUrlRaw = params.loginUrl.trim()
  const loginUrl = loginUrlRaw.startsWith("http")
    ? loginUrlRaw
    : loginUrlRaw
      ? `https://${loginUrlRaw}`
      : ""

  // Template exige URL absoluta no RESET_LINK; sem URL válida, só HTML inline
  const canUseTemplate = Boolean(loginUrl && loginUrl.startsWith("http"))

  // Variáveis para o template Resend — RESET_LINK é o mais comum em password reset.
  // Incluímos aliases para templates clonados que usem outros nomes.
  const templateVariables: Record<string, string> = {
    RESET_LINK: loginUrl,
    ACTION_URL: loginUrl,
    LOGIN_URL: loginUrl,
    USER_NAME: params.username,
    TEMPORARY_PASSWORD: params.temporaryPassword,
    PASSWORD: params.temporaryPassword,
    NEW_PASSWORD: params.temporaryPassword,
  }

  const headers = {
    Authorization: `Bearer ${params.resendKey}`,
    "Content-Type": "application/json",
  }

  // 1) Template password-reset-notification (sem html no payload)
  if (canUseTemplate) try {
    const resTemplate = await fetch(RESEND_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject,
        template: {
          id: RESEND_PASSWORD_RESET_TEMPLATE_ID,
          variables: templateVariables,
        },
      }),
    })
    if (resTemplate.ok) return true
    // Se validação falhar (variável obrigatória faltando etc.), cai no fallback
    if (resTemplate.status !== 422 && resTemplate.status !== 400 && resTemplate.status !== 404) {
      // Outros erros (403, 429): não tentar html duplicado
      if (process.env.NODE_ENV === "development") {
        const errText = await resTemplate.text()
        console.warn("[resend] template send failed", resTemplate.status, errText.slice(0, 300))
      }
      return false
    }
  } catch {
    /* rede — tenta fallback */
  }

  // 2) Fallback: HTML inline (sempre inclui senha no corpo)
  const htmlLoginUrl = loginUrl || params.loginUrl || "#"
  try {
    const resHtml = await fetch(RESEND_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject,
        html: buildFallbackHtml({
          username: params.username,
          temporaryPassword: params.temporaryPassword,
          loginUrl: htmlLoginUrl,
        }),
      }),
    })
    return resHtml.ok
  } catch {
    return false
  }
}
