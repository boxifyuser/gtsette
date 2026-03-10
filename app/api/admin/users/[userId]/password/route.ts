import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { getAdminSession } from "@/lib/session-admin"
import { setPasswordByUserId, getUserById } from "@/lib/auth-neon"
import { listUsersWithCadastro } from "@/lib/admin-users"
import {
  buildWhatsappSendUrl,
  normalizeWhatsappPhone,
  sendWhatsappViaTwilio,
} from "@/lib/whatsapp-password"

function generateTemporaryPassword(length = 12): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
  const bytes = randomBytes(length)
  let out = ""
  for (let i = 0; i < length; i++) out += chars[bytes[i]! % chars.length]
  return out
}

async function userExists(userId: string): Promise<boolean> {
  const users = await listUsersWithCadastro()
  return users.some((u) => u.id === userId)
}

/**
 * PATCH — admin define senha manualmente.
 * Body: { password: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { userId } = await params
  if (!userId) return NextResponse.json({ error: "userId obrigatório." }, { status: 400 })
  const exists = await userExists(userId)
  if (!exists) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 })
  }
  const password = typeof body.password === "string" ? body.password : ""
  const result = await setPasswordByUserId(userId, password)
  if ("error" in result) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}

/**
 * POST — gera senha temporária, grava no banco e envia por e-mail e/ou WhatsApp.
 * Body opcional:
 *   { sendEmail?: boolean } — default true; envia por Resend se configurado.
 *   { delivery?: "email" | "whatsapp" | "both" } — "whatsapp" não envia e-mail; "both" tenta os dois.
 *   { whatsappPhone?: string } — DDD+número ou com 55; obrigatório para link/API WhatsApp.
 * Se Twilio WhatsApp estiver configurado e whatsappPhone válido, envia pela API; senão retorna whatsappLink (wa.me).
 * Sempre retorna temporaryPassword uma vez (cópia manual / reenvio).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const { userId } = await params
  if (!userId) return NextResponse.json({ error: "userId obrigatório." }, { status: 400 })
  const exists = await userExists(userId)
  if (!exists) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })

  const user = await getUserById(userId)
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })

  const users = await listUsersWithCadastro()
  const cadastro = users.find((u) => u.id === userId)
  const email = cadastro?.email?.trim() || null

  let sendEmail = true
  let delivery: "email" | "whatsapp" | "both" = "email"
  let whatsappPhone: string | null = null
  try {
    const body = await request.json().catch(() => ({}))
    if (body && typeof body === "object") {
      if (body.sendEmail === false) sendEmail = false
      if (body.delivery === "whatsapp" || body.delivery === "email" || body.delivery === "both") {
        delivery = body.delivery
      }
      if (typeof body.whatsappPhone === "string" && body.whatsappPhone.trim()) {
        whatsappPhone = normalizeWhatsappPhone(body.whatsappPhone.trim())
      }
    }
  } catch {
    /* ignore */
  }
  if (delivery === "whatsapp") sendEmail = false
  if (delivery === "both") sendEmail = true

  const temporaryPassword = generateTemporaryPassword(14)
  const setResult = await setPasswordByUserId(userId, temporaryPassword)
  if ("error" in setResult) {
    return NextResponse.json({ success: false, error: setResult.error }, { status: 400 })
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "")
  const loginHint = siteUrl ? `${siteUrl}/minha-conta` : "/minha-conta"

  let emailSent = false
  let whatsappSent = false
  let whatsappLink: string | undefined
  const resendKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev"

  const whatsappMessage =
    `Olá! Foi gerada uma nova senha para acesso à área do cliente GTSETTE.\n\n` +
    `Usuário: ${user.username}\n` +
    `Senha temporária: ${temporaryPassword}\n\n` +
    `Acesse: ${loginHint}\n\n` +
    `Recomendamos alterar a senha após o primeiro acesso.`

  if (delivery === "whatsapp" || delivery === "both") {
    if (whatsappPhone) {
      const twilioResult = await sendWhatsappViaTwilio(whatsappPhone, whatsappMessage)
      if (twilioResult.ok) {
        whatsappSent = true
      } else {
        whatsappLink = buildWhatsappSendUrl(whatsappPhone, whatsappMessage)
      }
    }
  }

  if (sendEmail && resendKey && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Nova senha de acesso — área do cliente",
          html: `
            <p>Olá,</p>
            <p>Foi definida uma nova senha para acesso à área do cliente.</p>
            <p><strong>Usuário:</strong> ${escapeHtml(user.username)}<br/>
            <strong>Senha temporária:</strong> ${escapeHtml(temporaryPassword)}</p>
            <p>Acesse: <a href="${escapeHtml(loginHint)}">${escapeHtml(loginHint)}</a></p>
            <p>Recomendamos alterar a senha após o primeiro acesso, se disponível.</p>
          `,
        }),
      })
      if (res.ok) emailSent = true
    } catch {
      /* fall through — client still gets password to copy */
    }
  }

  let message = "Senha gerada."
  if (emailSent && whatsappSent) message = "E-mail e WhatsApp enviados com a nova senha."
  else if (emailSent) message = "E-mail enviado com a nova senha."
  else if (whatsappSent) message = "Mensagem enviada por WhatsApp (Twilio)."
  else if (whatsappLink) message = "Abra o link do WhatsApp abaixo para enviar a mensagem com a senha."
  else if (delivery === "whatsapp" && !whatsappPhone)
    message = "Informe o número do WhatsApp (DDD + número) para gerar o link ou configure Twilio."
  else if (email)
    message =
      "Senha gerada. Copie e envie ao usuário ou configure RESEND / Twilio WhatsApp para envio automático."
  else message = "Senha gerada. Copie e envie ao usuário (sem e-mail no cadastro)."

  return NextResponse.json({
    success: true,
    emailSent,
    whatsappSent,
    whatsappLink,
    email: email || undefined,
    temporaryPassword,
    message,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
