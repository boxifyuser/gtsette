import { NextResponse } from "next/server"
import { clearAdminSessionCookieOnResponse } from "@/lib/session-admin"

export async function POST() {
  const res = NextResponse.json({ success: true })
  return clearAdminSessionCookieOnResponse(res)
}
