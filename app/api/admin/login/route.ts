import { NextRequest, NextResponse } from "next/server"
import { getAdminByUsername, verifyAdminPassword } from "@/lib/auth-admin"
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionPayload,
  getAdminSessionCookieOptions,
} from "@/lib/session-admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = typeof body.username === "string" ? body.username.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""
    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Usuário e senha obrigatórios." }, { status: 400 })
    }
    const admin = await getAdminByUsername(username)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Usuário ou senha incorretos." }, { status: 401 })
    }
    const valid = await verifyAdminPassword(password, admin.password_hash)
    if (!valid) {
      return NextResponse.json({ success: false, error: "Usuário ou senha incorretos." }, { status: 401 })
    }
    const payload = createAdminSessionPayload(admin.id, admin.username)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Configure SESSION_SECRET no servidor." }, { status: 503 })
    }
    // Cookie na própria resposta — cookies().set() + NextResponse.json() nem sempre envia Set-Cookie
    const res = NextResponse.json({ success: true })
    res.cookies.set(ADMIN_SESSION_COOKIE_NAME, payload, getAdminSessionCookieOptions())
    return res
  } catch (e) {
    console.error("[admin/login]", e)
    return NextResponse.json({ success: false, error: "Erro ao fazer login." }, { status: 500 })
  }
}
