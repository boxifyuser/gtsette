import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-neon"
import { createSessionPayloadForUser, setSessionCookie } from "@/lib/session"

/**
 * POST /api/auth/register
 * Body: { username: string, password: string }
 * Cria usuário no Neon e inicia sessão.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = typeof body.username === "string" ? body.username.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Usuário e senha são obrigatórios." },
        { status: 400 }
      )
    }

    const result = await createUser(username, password)
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    const payload = createSessionPayloadForUser(result.user.id, result.user.username)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar sessão. Configure SESSION_SECRET no servidor." },
        { status: 503 }
      )
    }
    await setSessionCookie(payload)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[auth/register]", e)
    return NextResponse.json(
      { success: false, error: "Erro ao criar conta." },
      { status: 500 }
    )
  }
}
