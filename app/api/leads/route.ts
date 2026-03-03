import { NextRequest, NextResponse } from "next/server"

const BOXIFY_BASE = process.env.BOXIFY_API_BASE_URL || "http://boxify.com.br/api/v1"
const BOXIFY_TOKEN = process.env.BOXIFY_API_TOKEN || "bx_UcJ8RcYOarmwMH07icG7-4KKG2Q-pVUN"

/** Extrai valor numérico de string (ex: "R$ 50.000" -> 50000) */
function parseValue(value: string | undefined): number | undefined {
  if (!value || typeof value !== "string") return undefined
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return undefined
  return parseInt(digits, 10)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, value: valueRaw, source } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const value = parseValue(valueRaw)

    const payload: Record<string, unknown> = {
      name: name.trim(),
      status: "new",
    }
    if (email && String(email).trim()) payload.email = String(email).trim()
    if (phone && String(phone).trim()) payload.phone = String(phone).trim()
    if (value !== undefined) payload.value = value

    const res = await fetch(`${BOXIFY_BASE}/leads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BOXIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Erro ao cadastrar lead", details: data },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("[api/leads]", err)
    return NextResponse.json(
      { error: "Erro interno ao cadastrar lead" },
      { status: 500 }
    )
  }
}
