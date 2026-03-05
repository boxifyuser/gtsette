import { NextResponse } from "next/server"
import { deleteSessionCookie } from "@/lib/session"

/**
 * POST /api/auth/logout
 * Remove a sessão (cookie).
 */
export async function POST() {
  await deleteSessionCookie()
  return NextResponse.json({ success: true })
}
