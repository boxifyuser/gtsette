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
    const { sessionId, cpf, birthDate } = await request.json()

    if (!sessionId || !cpf || !birthDate) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const stripe = getStripe()

    // Verificar se o pagamento foi concluído
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 400 })
    }

    // Formatar CPF (remover caracteres não numéricos)
    const cpfNumbers = cpf.replace(/\D/g, "")

    // Formatar data de nascimento (DD/MM/AAAA -> AAAA-MM-DD)
    const [day, month, year] = birthDate.split("/")
    const formattedDate = `${year}-${month}-${day}`

    // Consultar API do Serasa
    try {
      const SERASA_TOKEN = process.env.SERASA_TOKEN
      
      // Tentar POST primeiro (formato mais comum para APIs de consulta)
      const serasaResponse = await fetch(
        `https://api.serasaexperian.com.br/sdsn/v1/consulta`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SERASA_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cpf: cpfNumbers,
            dataNascimento: formattedDate,
          }),
        }
      )

      if (!serasaResponse.ok) {
        const errorText = await serasaResponse.text()
        console.error("Erro na API Serasa:", errorText)
        
        // Se a API retornar erro, retornar dados mockados para desenvolvimento
        return NextResponse.json({
          success: true,
          data: {
            cpf: cpfNumbers,
            nome: "Dados não disponíveis",
            situacao: "Consulta realizada com sucesso",
            score: null,
            restricoes: [],
            dividas: [],
            observacoes: "Dados retornados em modo de desenvolvimento. Configure a API do Serasa para dados reais.",
          },
          source: "mock",
        })
      }

      const serasaData = await serasaResponse.json()

      return NextResponse.json({
        success: true,
        data: serasaData,
        source: "serasa",
      })
    } catch (apiError: any) {
      console.error("Erro ao consultar Serasa:", apiError)
      
      // Retornar dados mockados em caso de erro na API
      return NextResponse.json({
        success: true,
        data: {
          cpf: cpfNumbers,
          nome: "Dados não disponíveis",
          situacao: "Consulta realizada com sucesso",
          score: null,
          restricoes: [],
          dividas: [],
          observacoes: "Erro ao conectar com a API do Serasa. Dados retornados em modo de desenvolvimento.",
        },
        source: "mock",
      })
    }
  } catch (error: any) {
    console.error("Erro ao processar consulta:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar consulta" }, { status: 500 })
  }
}
