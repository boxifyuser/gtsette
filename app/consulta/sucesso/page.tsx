"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, AlertCircle, FileText, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"

type ConsultaData = {
  cpf: string
  nome?: string
  situacao?: string
  score?: number
  restricoes?: Array<{
    orgao: string
    tipo: string
    data: string
  }>
  dividas?: Array<{
    credor: string
    valor: number
    vencimento: string
  }>
  observacoes?: string
}

function ConsultaSucessoContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [consultaData, setConsultaData] = useState<ConsultaData | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    const cpf = searchParams.get("cpf")
    const birthDate = searchParams.get("birthDate")

    if (!sessionId || !cpf || !birthDate) {
      setError("Parâmetros inválidos. Por favor, tente novamente.")
      setLoading(false)
      return
    }

    const consultarSerasa = async () => {
      try {
        const response = await fetch("/api/consultar-serasa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            cpf,
            birthDate,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao consultar dados")
        }

        setConsultaData(data.data)
      } catch (err: any) {
        setError(err.message || "Erro ao processar consulta")
      } finally {
        setLoading(false)
      }
    }

    consultarSerasa()
  }, [searchParams])

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Consultando dados do CPF...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <section className="bg-background px-4 py-16">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <div>
                    <CardTitle className="text-2xl">Erro na Consulta</CardTitle>
                    <CardDescription>Não foi possível processar sua consulta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/consulta">Tentar Novamente</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-primary px-4 py-16 text-white md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-300" />
          <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Consulta Realizada com Sucesso!</h1>
          <p className="text-balance text-lg text-white/90">Abaixo estão os dados consultados do seu CPF</p>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* CPF Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do CPF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF</p>
                  <p className="text-lg font-semibold">{consultaData?.cpf ? formatCPF(consultaData.cpf) : "N/A"}</p>
                </div>
                {consultaData?.nome && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-lg font-semibold">{consultaData.nome}</p>
                  </div>
                )}
              </div>
              {consultaData?.situacao && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Situação</p>
                  <p className="text-lg font-semibold">{consultaData.situacao}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score */}
          {consultaData?.score !== null && consultaData?.score !== undefined && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Score de Crédito</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">{consultaData.score}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Pontuação atual</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restrições */}
          {consultaData?.restricoes && consultaData.restricoes.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <CardTitle>Restrições e Pendências</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultaData.restricoes.map((restricao, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{restricao.orgao}</p>
                          <p className="text-sm text-muted-foreground">{restricao.tipo}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{restricao.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dívidas */}
          {consultaData?.dividas && consultaData.dividas.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Dívidas Registradas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultaData.dividas.map((divida, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{divida.credor}</p>
                          <p className="text-sm text-muted-foreground">Vencimento: {divida.vencimento}</p>
                        </div>
                        <p className="text-lg font-bold text-primary">{formatCurrency(divida.valor)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {consultaData?.observacoes && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>{consultaData.observacoes}</AlertDescription>
            </Alert>
          )}

          {/* No Data Message */}
          {!consultaData?.restricoes?.length && !consultaData?.dividas?.length && consultaData?.score === null && (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <p className="text-lg font-semibold">Nenhuma restrição encontrada</p>
                <p className="mt-2 text-muted-foreground">
                  Seu CPF não possui restrições ou pendências registradas nos órgãos de proteção ao crédito.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/consulta">Nova Consulta</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ConsultaSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <ConsultaSucessoContent />
    </Suspense>
  )
}
