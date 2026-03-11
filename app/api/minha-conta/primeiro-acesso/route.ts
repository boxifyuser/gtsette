import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { setPasswordByUserId } from "@/lib/auth-neon"
import {
  findUserIdByPrimeiroAcesso,
  birthDateToYyyyMmDd,
  validateCPF,
} from "@/lib/cadastro"
import { sendTemporaryPasswordEmail } from "@/lib/send-password-email"

const WHATSAPP_CONTACT = "+5531982506478"
const WHATSAPP_MESSAGE =
  "Olá! Não encontrei meu cadastro no primeiro acesso da área do cliente. Podem me ajudar?"

function generateTemporaryPassword(length = 14): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
  const bytes = randomBytes(length)
  let out = ""
  for (let i = 0; i < length; i++) out += chars[bytes[i]! % chars.length]
  return out
}

function validBirthDateDdMmYyyy(value: string): boolean {
  const n = value.replace(/\D/g, "")
  if (n.length !== 8) return false
  const day = parseInt(n.slice(0, 2), 10)
  const month = parseInt(n.slice(2, 4), 10)
  const year = parseInt(n.slice(4, 8), 10)
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > new Date().getFullYear()) return false
  return true
}

/**
 * POST /api/minha-conta/primeiro-acesso
 * Body: { cpf, dataNascimento (DD/MM/AAAA), email, telefone (com DDD) }
 * Se cadastro ativo com match completo: gera senha e envia por e-mail (Resend).
 * Caso contrário: orienta contato WhatsApp.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cpf = typeof body.cpf === "string" ? body.cpf : ""
    const dataNascimento = typeof body.dataNascimento === "string" ? body.dataNascimento.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const telefone = typeof body.telefone === "string" ? body.telefone.trim() : ""

    if (!cpf || !dataNascimento || !email || !telefone) {
      return NextResponse.json(
        {
          success: false,
          error: "Preencha CPF, data de nascimento, e-mail e telefone.",
          whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        },
        { status: 400 }
      )
    }

    if (!validateCPF(cpf)) {
      return NextResponse.json(
        {
          success: false,
          error: "CPF inválido.",
          whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        },
        { status: 400 }
      )
    }

    if (!validBirthDateDdMmYyyy(dataNascimento)) {
      return NextResponse.json(
        {
          success: false,
          error: "Data de nascimento inválida. Use DD/MM/AAAA.",
          whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "E-mail inválido.",
          whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        },
        { status: 400 }
      )
    }

    const dataYyyyMmDd = birthDateToYyyyMmDd(dataNascimento)
    if (!dataYyyyMmDd) {
      return NextResponse.json(
        {
          success: false,
          error: "Data de nascimento inválida.",
          whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        },
        { status: 400 }
      )
    }

    const userId = await findUserIdByPrimeiroAcesso({
      cpf,
      email,
      telefone,
      dataNascimentoYyyyMmDd: dataYyyyMmDd,
    })

    if (!userId) {
      return NextResponse.json({
        success: false,
        noMatch: true,
        error:
          "Não encontramos cadastro ativo com esses dados. Entre em contato pelo WhatsApp para concluir seu cadastro.",
        whatsappUrl: `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        whatsappDisplay: WHATSAPP_CONTACT,
      })
    }

    const temporaryPassword = generateTemporaryPassword(14)
    const setResult = await setPasswordByUserId(userId, temporaryPassword)
    if ("error" in setResult) {
      return NextResponse.json(
        { success: false, error: setResult.error },
        { status: 500 }
      )
    }

    const sent = await sendTemporaryPasswordEmail(userId, temporaryPassword)

    return NextResponse.json({
      success: true,
      message: sent.ok
        ? "Enviamos sua senha de acesso para o e-mail cadastrado. Use e-mail ou telefone + senha para entrar."
        : "Senha gerada. Como o e-mail automático não está disponível, entre em contato pelo WhatsApp para receber sua senha.",
      emailSent: sent.ok,
      emailMasked: sent.email ? sent.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : undefined,
      whatsappUrl: sent.ok
        ? undefined
        : `https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}?text=${encodeURIComponent("Preciso receber minha senha de primeiro acesso.")}`,
    })
  } catch (e) {
    console.error("[minha-conta/primeiro-acesso]", e)
    return NextResponse.json(
      { success: false, error: "Erro ao processar. Tente novamente." },
      { status: 500 }
    )
  }
}
