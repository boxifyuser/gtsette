import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { setPasswordByUserId } from "@/lib/auth-neon"
import { findUserIdByEmail } from "@/lib/cadastro"
import { sendTemporaryPasswordEmail } from "@/lib/send-password-email"

function generateTemporaryPassword(length = 14): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
  const bytes = randomBytes(length)
  let out = ""
  for (let i = 0; i < length; i++) out += chars[bytes[i]! % chars.length]
  return out
}

/**
 * POST /api/auth/forgot-password
 * Body: { email: string }
 * Gera nova senha e envia para o e-mail do cadastro (Resend — mesmo remetente padrão do Neon/auth).
 * Resposta genérica se e-mail não existir (não revela se o e-mail está cadastrado).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Informe um e-mail válido." },
        { status: 400 }
      )
    }

    const userId = await findUserIdByEmail(email)
    const genericMessage =
      "Se este e-mail estiver cadastrado, você receberá uma nova senha em instantes. Verifique a caixa de entrada e o spam."

    if (!userId) {
      return NextResponse.json({ success: true, message: genericMessage })
    }

    const temporaryPassword = generateTemporaryPassword(14)
    const setResult = await setPasswordByUserId(userId, temporaryPassword)
    if ("error" in setResult) {
      return NextResponse.json({ success: true, message: genericMessage })
    }

    await sendTemporaryPasswordEmail(userId, temporaryPassword)

    return NextResponse.json({ success: true, message: genericMessage })
  } catch (e) {
    console.error("[auth/forgot-password]", e)
    return NextResponse.json(
      { success: false, error: "Erro ao processar. Tente novamente." },
      { status: 500 }
    )
  }
}
