import { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE_NAME = "admin_sessao"
const COOKIE_NAME = ADMIN_SESSION_COOKIE_NAME
const MAX_AGE = 60 * 60 * 8 // 8 horas

/** Opções do cookie de sessão admin — use em NextResponse.cookies.set para o Set-Cookie ir na resposta. */
export function getAdminSessionCookieOptions(): {
  httpOnly: boolean
  secure: boolean
  sameSite: "lax"
  maxAge: number
  path: string
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  }
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET || process.env.BOXIFY_SESSION_SECRET
  if (!s || s.length < 16) return ""
  return s.replace(/\r\n|\r|\n/g, "").trim()
}

function sign(payload: string): string {
  const secret = getSecret()
  if (!secret) return ""
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export interface AdminSessionData {
  adminId: string
  username: string
  exp: number
}

export function createAdminSessionPayload(adminId: string, username: string): string {
  const payload: AdminSessionData = { adminId, username, exp: Date.now() + MAX_AGE * 1000 }
  const payloadStr = JSON.stringify(payload)
  const payloadBase64 = Buffer.from(payloadStr, "utf-8").toString("base64url")
  const signature = sign(payloadBase64)
  if (!signature) return ""
  return `${payloadBase64}.${signature}`
}

export async function getAdminSession(): Promise<AdminSessionData | null> {
  const secret = getSecret()
  if (!secret) return null
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value
  if (!value) return null
  const [payloadBase64, signature] = value.split(".")
  if (!payloadBase64 || !signature) return null
  const expectedSig = sign(payloadBase64)
  if (!expectedSig) return null
  const sigBuf = Buffer.from(signature, "base64url")
  const expectedBuf = Buffer.from(expectedSig, "base64url")
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null
  try {
    const payloadStr = Buffer.from(payloadBase64, "base64url").toString("utf-8")
    const data: AdminSessionData = JSON.parse(payloadStr)
    if (data.exp && Date.now() > data.exp) return null
    return data
  } catch {
    return null
  }
}

export async function setAdminSessionCookie(payload: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, payload, getAdminSessionCookieOptions())
}

export async function deleteAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Limpa o cookie na resposta (preferir no logout para o browser receber Set-Cookie de expiração). */
export function clearAdminSessionCookieOnResponse(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", { ...getAdminSessionCookieOptions(), maxAge: 0 })
  return res
}
