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
  const doc = session.document
  const masked =
    doc.length === 11
      ? `${doc.slice(0, 3)}.***.***-${doc.slice(-2)}`
      : `${doc.slice(0, 2)}.**.***/****-${doc.slice(-2)}`
  return NextResponse.json({
    session: { document: masked, birthDate: "**/**/****" },
  })
}
