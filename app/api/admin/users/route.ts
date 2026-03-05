import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { listUsersWithCadastro } from "@/lib/admin-users"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const users = await listUsersWithCadastro()
  return NextResponse.json({ users })
}
