import { NextResponse } from "next/server"
import { deleteAdminSessionCookie } from "@/lib/session-admin"

export async function POST() {
  await deleteAdminSessionCookie()
  return NextResponse.json({ success: true })
}
