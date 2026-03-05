import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getCadastroByUserId, saveCadastro } from "@/lib/cadastro"

/**
 * GET /api/minha-conta/cadastro
 * Retorna o cadastro do usuário logado (Neon). 401 se não logado ou sessão Boxify.
 */
export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ cadastro: null }, { status: 401 })
  }
  const cadastro = await getCadastroByUserId(session.userId)
  return NextResponse.json({ cadastro })
}

/**
 * POST /api/minha-conta/cadastro
 * Body: { nome_completo, cpf, email, cnpj? }
 * Salva ou atualiza o cadastro do usuário logado (Neon).
 */
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 })
  }
  try {
    const body = await request.json()
    const nome_completo = typeof body.nome_completo === "string" ? body.nome_completo : ""
    const cpf = typeof body.cpf === "string" ? body.cpf : ""
    const email = typeof body.email === "string" ? body.email : ""
    const cnpj = typeof body.cnpj === "string" ? body.cnpj : null
    const lgpd_consent = Boolean(body.lgpd_consent)
    const result = await saveCadastro(session.userId, {
      nome_completo,
      cpf,
      email,
      cnpj: cnpj && cnpj.trim() ? cnpj : null,
      lgpd_consent,
    })
    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[minha-conta/cadastro] POST:", e)
    return NextResponse.json({ success: false, error: "Erro ao salvar." }, { status: 500 })
  }
}
