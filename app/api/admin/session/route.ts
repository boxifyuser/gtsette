import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ session: null })
  return NextResponse.json({ session: { adminId: session.adminId, username: session.username } })
}
