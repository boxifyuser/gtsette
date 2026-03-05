import { NextResponse } from "next/server"
import { seedAdminIfEmpty } from "@/lib/auth-admin"

/** POST: cria o primeiro admin se não existir nenhum. Requer ADMIN_SEED_USERNAME e ADMIN_SEED_PASSWORD no .env */
export async function POST() {
  const result = await seedAdminIfEmpty()
  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  }
  return NextResponse.json({ success: true, created: result.created })
}
