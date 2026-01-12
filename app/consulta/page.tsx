"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react"

type ProcessStatus = {
  status: "em-andamento" | "concluido" | "pendente" | "analise"
  message: string
  details: {
    serasa?: string
    spc?: string
    boaVista?: string
    cenprot?: string
  }
  lastUpdate: string
}

export default function ConsultaPage() {
  const [cpf, setCpf] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [result, setResult] = useState<ProcessStatus | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2")
    }
    return value
  }

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "")
    if (numbers.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) return false

    // Validação dos dígitos verificadores
    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(numbers.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(numbers.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(numbers.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(numbers.substring(10, 11))) return false

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!validateCPF(cpf)) {
      setError("CPF inválido. Por favor, verifique os dados.")
      return
    }

    if (birthDate.replace(/\D/g, "").length !== 8) {
      setError("Data de nascimento inválida. Use o formato DD/MM/AAAA.")
      return
    }

    setLoading(true)

    // Simulação de consulta (em produção, fazer chamada à API)
    setTimeout(() => {
      // Mock de diferentes status baseado no CPF
      const cpfNumber = cpf.replace(/\D/g, "")
      const lastDigit = Number.parseInt(cpfNumber.charAt(cpfNumber.length - 1))

      let mockResult: ProcessStatus

      if (lastDigit >= 0 && lastDigit <= 3) {
        mockResult = {
          status: "em-andamento",
          message: "Seu processo está em andamento",
          details: {
            serasa: "Baixado",
            spc: "Em processamento",
            boaVista: "Aguardando confirmação",
            cenprot: "Baixado",
          },
          lastUpdate: new Date().toLocaleDateString("pt-BR"),
        }
      } else if (lastDigit >= 4 && lastDigit <= 6) {
        mockResult = {
          status: "concluido",
          message: "Processo concluído com sucesso!",
          details: {
            serasa: "Baixado",
            spc: "Baixado",
            boaVista: "Baixado",
            cenprot: "Baixado",
          },
          lastUpdate: new Date().toLocaleDateString("pt-BR"),
        }
      } else if (lastDigit >= 7 && lastDigit <= 8) {
        mockResult = {
          status: "pendente",
          message: "Aguardando documentação",
          details: {
            serasa: "Pendente",
            spc: "Pendente",
            boaVista: "Não iniciado",
            cenprot: "Não iniciado",
          },
          lastUpdate: new Date().toLocaleDateString("pt-BR"),
        }
      } else {
        mockResult = {
          status: "analise",
          message: "Em análise pela equipe",
          details: {
            serasa: "Em análise",
            spc: "Em análise",
            boaVista: "Aguardando",
            cenprot: "Aguardando",
          },
          lastUpdate: new Date().toLocaleDateString("pt-BR"),
        }
      }

      setResult(mockResult)
      setLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "em-andamento":
        return <Clock className="h-8 w-8 text-blue-500" />
      case "concluido":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />
      case "pendente":
        return <AlertCircle className="h-8 w-8 text-amber-500" />
      case "analise":
        return <FileText className="h-8 w-8 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em-andamento":
        return "border-blue-500 bg-blue-50"
      case "concluido":
        return "border-green-500 bg-green-50"
      case "pendente":
        return "border-amber-500 bg-amber-50"
      case "analise":
        return "border-purple-500 bg-purple-50"
      default:
        return ""
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-primary px-4 py-16 text-white md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Verificar Nome</h1>
          <p className="text-balance text-lg text-white/90">Verifique o andamento do seu processo de limpeza de nome</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Digite seus dados</CardTitle>
              <CardDescription>
                Informe seu CPF e data de nascimento para consultar o status do processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    placeholder="DD/MM/AAAA"
                    value={birthDate}
                    onChange={(e) => setBirthDate(formatDate(e.target.value))}
                    maxLength={10}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Consultando..." : "Verificar Nome"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card className={`mt-8 border-2 ${getStatusColor(result.status)}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {getStatusIcon(result.status)}
                  <div>
                    <CardTitle className="text-2xl">{result.message}</CardTitle>
                    <CardDescription className="mt-1">Última atualização: {result.lastUpdate}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Status por Órgão:</h3>
                  <div className="grid gap-3">
                    {result.details.serasa && (
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                        <span className="font-medium">SERASA</span>
                        <span className="text-sm text-muted-foreground">{result.details.serasa}</span>
                      </div>
                    )}
                    {result.details.spc && (
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                        <span className="font-medium">SPC Brasil</span>
                        <span className="text-sm text-muted-foreground">{result.details.spc}</span>
                      </div>
                    )}
                    {result.details.boaVista && (
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                        <span className="font-medium">Boa Vista</span>
                        <span className="text-sm text-muted-foreground">{result.details.boaVista}</span>
                      </div>
                    )}
                    {result.details.cenprot && (
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                        <span className="font-medium">CENPROT</span>
                        <span className="text-sm text-muted-foreground">{result.details.cenprot}</span>
                      </div>
                    )}
                  </div>
                  <Alert>
                    <AlertDescription>
                      Em caso de dúvidas sobre seu processo, entre em contato com nossa equipe através do WhatsApp ou
                      formulário de contato.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold">Como funciona esta consulta?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Esta página permite que você acompanhe, em tempo real, o andamento do seu processo de limpeza de nome.
            </p>
            <p>
              As informações são organizadas por órgão de proteção ao crédito (SERASA, SPC Brasil, Boa Vista, CENPROT)
              para que você tenha visibilidade completa de cada etapa.
            </p>
            <p>
              Os status são atualizados diariamente pela nossa equipe. Em caso de dúvidas específicas sobre seu CPF ou
              processo, entre em contato através dos nossos canais de atendimento.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
