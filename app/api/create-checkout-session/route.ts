import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY não configurada")
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-12-18.acacia",
  })
}

export async function POST(request: NextRequest) {
  try {
    const { cpf, birthDate } = await request.json()

    if (!cpf || !birthDate) {
      return NextResponse.json({ error: "CPF e data de nascimento são obrigatórios" }, { status: 400 })
    }

    const stripe = getStripe()

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Consulta de CPF - Serasa Experian",
              description: `Consulta completa de CPF: ${cpf}`,
            },
            unit_amount: 5000, // R$ 50,00 em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/consulta/sucesso?session_id={CHECKOUT_SESSION_ID}&cpf=${encodeURIComponent(cpf)}&birthDate=${encodeURIComponent(birthDate)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/consulta?canceled=true`,
      metadata: {
        cpf: cpf.replace(/\D/g, ""),
        birthDate: birthDate,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Erro ao criar sessão de checkout:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 500 })
  }
}
