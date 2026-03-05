import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

/**
 * GET /api/auth/session
 * Retorna a sessão atual (document e birthDate mascarados) se existir.
 */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ session: null })
  }
  if (session.userId && session.username) {
    return NextResponse.json({
      session: { userId: session.userId, username: session.username, type: "neon" },
    })
  }
  const doc = session.document ?? ""
  const masked =
    doc.length === 11
      ? `${doc.slice(0, 3)}.***.***-${doc.slice(-2)}`
      : doc.length >= 14
        ? `${doc.slice(0, 2)}.**.***/****-${doc.slice(-2)}`
        : "***"
  return NextResponse.json({
    session: { document: masked, birthDate: "**/**/****", type: "boxify" },
  })
}
