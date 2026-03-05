import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session-admin"
import { getOrgaos } from "@/lib/admin-orgaos"

const FIXED_HEADERS = [
  "nome_completo",
  "cpf",
  "email",
  "cnpj",
  "tipo_processo",
  "status_processo",
  "observacoes",
  "data_atualizacao",
  "data_conclusao",
]

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const orgaos = await getOrgaos(true)
  const orgaoNomes = orgaos.map((o) => o.nome)
  const headers = [...FIXED_HEADERS, ...orgaoNomes]
  const headerLine = headers.join(";")
  const exampleFixed = "João da Silva;12345678901;joao@email.com;;Limpeza de nome;Em andamento;Cliente entrou em contato.;2025-03-01;2025-03-15"
  const exampleOrgaos = orgaoNomes.map(() => "Em andamento").join(";")
  const exampleLine = orgaoNomes.length > 0 ? `${exampleFixed};${exampleOrgaos}` : exampleFixed
  const csv = [headerLine, exampleLine].join("\n")
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="modelo-leads.csv"',
    },
  })
}
