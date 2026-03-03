import { NextRequest, NextResponse } from "next/server"

// BOXIFY_API_BASE_URL e BOXIFY_API_TOKEN devem estar definidos em .env.local

/** Extrai valor numérico de string (ex: "R$ 50.000" -> 50000) */
function parseValue(value: string | undefined): number | undefined {
  if (!value || typeof value !== "string") return undefined
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return undefined
  return parseInt(digits, 10)
}

export async function POST(request: NextRequest) {
  try {
    const boxifyBase = process.env.BOXIFY_API_BASE_URL
    const boxifyToken = process.env.BOXIFY_API_TOKEN

    if (!boxifyToken?.trim()) {
      return NextResponse.json(
        { error: "Token inválido ou ausente. Configure BOXIFY_API_TOKEN em .env.local" },
        { status: 503 }
      )
    }
    if (!boxifyBase?.trim()) {
      return NextResponse.json(
        { error: "URL da API não configurada. Configure BOXIFY_API_BASE_URL em .env.local" },
        { status: 503 }
      )
    }

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

    const res = await fetch(`${boxifyBase}/leads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${boxifyToken}`,
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
