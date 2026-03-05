"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertCircle, FileText, LogOut, AlertTriangle } from "lucide-react"

type ProcessStatus = "iniciado" | "em-andamento" | "100-baixado" | "reprotocolo"

type OrganStatus = {
  name: string
  status: "baixas-concluidas" | "aguardando-inicio" | "em-processamento" | "nao-iniciado"
  details: string[]
  lastProtocol?: string
  received?: string
  started?: string
  completed?: string
  warning?: string
}

type Process = {
  id: string
  date: string
  status: ProcessStatus
  lastUpdate: string
  organs: {
    serasa?: OrganStatus
    spc?: OrganStatus
    boaVista?: OrganStatus
    cenprotSP?: OrganStatus
    cenprotNacional?: OrganStatus
    outros?: OrganStatus
  }
}

export default function MinhaContaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [document, setDocument] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionCheckDone, setSessionCheckDone] = useState(false)
  const [leadData, setLeadData] = useState<Record<string, unknown> | null>(null)
  const [loadingLead, setLoadingLead] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<ProcessStatus | "todos">("todos")
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)

  // Mock data - usado apenas como fallback se lead não carregar
  const processes: Process[] = [
    {
      id: "1",
      date: "07/11/2025",
      status: "em-andamento",
      lastUpdate: "19/12/2025 às 10:39",
      organs: {
        serasa: {
          name: "SERASA",
          status: "baixas-concluidas",
          details: ["Baixas Concluídas."],
          warning: "▲ certifique-se de fazer consultas atualizadas em tempo real. Caso não identifique baixas em sua consulta, faça novamente no dia subsequente.",
          lastProtocol: "2025-12-04 às 17:24",
          received: "2025-12-04 às 17:38",
          started: "2025-11-26 às 16:20",
          completed: "2025-12-19 às 10:30",
        },
        spc: {
          name: "SPC",
          status: "baixas-concluidas",
          details: ["100% Baixado", "Baixas concluídas: 2025-12-05 às 10:15"],
        },
        boaVista: {
          name: "BOA VISTA",
          status: "baixas-concluidas",
          details: ["100% Baixado", "Baixas concluídas: 2025-11-19 às 19:00"],
        },
        cenprotSP: {
          name: "CENPROT SP",
          status: "aguardando-inicio",
          details: [
            "Não foi cumprido o prazo máximo de baixas no dia 12/12/2025",
            "Ainda não houve início significativo de baixas.",
            "Último protocolo enviado: 2025-12-04 às 17:15",
            "Recepcionado: 2025-12-04 às 17:29",
          ],
          lastProtocol: "2025-12-04 às 17:15",
          received: "2025-12-04 às 17:29",
        },
        cenprotNacional: {
          name: "CENPROT NACIONAL",
          status: "aguardando-inicio",
          details: [
            "Não foi cumprido o prazo máximo de baixas no dia 12/12/2025",
            "Ainda não houve início significativo de baixas.",
            "Último protocolo enviado: 2025-12-04 às 17:15",
            "Recepcionado: 2025-12-04 às 17:29",
          ],
          lastProtocol: "2025-12-04 às 17:15",
          received: "2025-12-04 às 17:29",
        },
      },
    },
    {
      id: "2",
      date: "10/12/2025",
      status: "em-andamento",
      lastUpdate: "18/12/2025 às 14:20",
      organs: {
        serasa: {
          name: "SERASA",
          status: "em-processamento",
          details: ["Baixas em processamento"],
          started: "2025-12-15 às 09:00",
        },
        spc: {
          name: "SPC",
          status: "aguardando-inicio",
          details: ["Aguardando início das baixas"],
        },
      },
    },
    {
      id: "3",
      date: "17/12/2025",
      status: "100-baixado",
      lastUpdate: "20/12/2025 às 16:45",
      organs: {
        serasa: {
          name: "SERASA",
          status: "baixas-concluidas",
          details: ["100% Baixado", "Baixas concluídas: 2025-12-20 às 16:00"],
          completed: "2025-12-20 às 16:00",
        },
        spc: {
          name: "SPC",
          status: "baixas-concluidas",
          details: ["100% Baixado", "Baixas concluídas: 2025-12-19 às 14:30"],
          completed: "2025-12-19 às 14:30",
        },
        boaVista: {
          name: "BOA VISTA",
          status: "baixas-concluidas",
          details: ["100% Baixado", "Baixas concluídas: 2025-12-18 às 11:20"],
          completed: "2025-12-18 às 11:20",
        },
      },
    },
    {
      id: "4",
      date: "28/11/2025",
      status: "100-baixado",
      lastUpdate: "15/12/2025 às 09:15",
      organs: {
        serasa: {
          name: "SERASA",
          status: "baixas-concluidas",
          details: ["100% Baixado"],
          completed: "2025-12-10 às 10:00",
        },
      },
    },
    {
      id: "5",
      date: "31/12/2025",
      status: "reprotocolo",
      lastUpdate: "21/12/2025 às 08:30",
      organs: {
        serasa: {
          name: "SERASA",
          status: "nao-iniciado",
          details: ["Processo em reprotocolo"],
        },
      },
    },
  ]

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
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

  const validateDocument = (doc: string): boolean => {
    const numbers = doc.replace(/\D/g, "")
    if (numbers.length === 11) {
      if (/^(\d)\1+$/.test(numbers)) return false
      let sum = 0
      for (let i = 1; i <= 9; i++) {
        sum += Number.parseInt(numbers[i - 1], 10) * (11 - i)
      }
      let remainder = (sum * 10) % 11
      if (remainder === 10) remainder = 0
      if (remainder !== Number.parseInt(numbers[9], 10)) return false
      sum = 0
      for (let i = 1; i <= 10; i++) {
        sum += Number.parseInt(numbers[i - 1], 10) * (12 - i)
      }
      remainder = (sum * 10) % 11
      if (remainder === 10) remainder = 0
      if (remainder !== Number.parseInt(numbers[10], 10)) return false
      return true
    }
    if (numbers.length === 14) {
      if (/^(\d)\1+$/.test(numbers)) return false
      const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      for (let i = 0; i < 12; i++) sum += Number.parseInt(numbers[i], 10) * w1[i]
      let remainder = sum % 11
      if (remainder < 2) remainder = 0
      else remainder = 11 - remainder
      if (remainder !== Number.parseInt(numbers[12], 10)) return false
      const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      sum = 0
      for (let i = 0; i < 13; i++) sum += Number.parseInt(numbers[i], 10) * w2[i]
      remainder = sum % 11
      if (remainder < 2) remainder = 0
      else remainder = 11 - remainder
      if (remainder !== Number.parseInt(numbers[13], 10)) return false
      return true
    }
    return false
  }

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.session) setIsLoggedIn(true)
      })
      .finally(() => setSessionCheckDone(true))
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    setLoadingLead(true)
    fetch("/api/minha-conta/lead")
      .then((r) => r.json())
      .then((data) => {
        if (data?.lead) setLeadData(data.lead)
        else setLeadData(null)
      })
      .catch(() => setLeadData(null))
      .finally(() => setLoadingLead(false))
  }, [isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!validateDocument(document)) {
      setError("CPF ou CNPJ inválido. Verifique os dados.")
      setLoading(false)
      return
    }

    if (birthDate.replace(/\D/g, "").length !== 8) {
      setError("Data de nascimento inválida. Use o formato DD/MM/AAAA.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, birthDate }),
      })
      const data = await res.json()

      if (data.success) {
        setIsLoggedIn(true)
      } else {
        setError(data.error || "Não foi possível entrar. Tente novamente.")
      }
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      /* ignore */
    }
    setIsLoggedIn(false)
  }

  const getStatusBadge = (status: ProcessStatus) => {
    switch (status) {
      case "iniciado":
        return (
          <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">
            <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
            INICIADO
          </Badge>
        )
      case "em-andamento":
        return (
          <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">
            <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
            EM ANDAMENTO
          </Badge>
        )
      case "100-baixado":
        return (
          <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
            <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            100% BAIXADO
          </Badge>
        )
      case "reprotocolo":
        return (
          <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-700">
            <div className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
            REPROTOCOLO
          </Badge>
        )
    }
  }

  const getOrganStatusBadge = (status: OrganStatus["status"]) => {
    switch (status) {
      case "baixas-concluidas":
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Baixas concluídas
          </Badge>
        )
      case "aguardando-inicio":
        return (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600">
            Aguardando início das baixas
          </Badge>
        )
      case "em-processamento":
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">
            Em processamento
          </Badge>
        )
      case "nao-iniciado":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700">
            Não iniciado
          </Badge>
        )
    }
  }

  const filteredProcesses = processes.filter((process) => {
    if (selectedFilter === "todos") return true
    return process.status === selectedFilter
  })

  const currentProcess = processes.find((p) => p.id === selectedProcess) || processes[0]

  if (!sessionCheckDone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <section className="bg-primary px-4 py-16 text-white md:py-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Minha Conta</h1>
            <p className="text-balance text-lg text-white/90">
              Acesse sua conta para acompanhar seus processos de limpeza de nome
            </p>
          </div>
        </section>

        {/* Login Form */}
        <section className="bg-background px-4 py-16">
          <div className="container mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Entrar na sua conta</CardTitle>
                <CardDescription>
                  Digite seu CPF ou CNPJ e data de nascimento para acessar sua área pessoal (autenticação via Boxify).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="document">CPF ou CNPJ</Label>
                    <Input
                      id="document"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={document}
                      onChange={(e) => setDocument(formatDocument(e.target.value))}
                      maxLength={18}
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
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <section className="border-b bg-card px-4 py-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Minha Conta</h1>
              <p className="text-sm text-muted-foreground">
                Página de consulta com informações em tempo real. As atualizações são realizadas exclusivamente pela
                coordenação.
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </section>

      {/* Conteúdo da sessão logada: apenas o card do lead */}
      <section className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          {loadingLead && (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Carregando seus dados...</p>
            </div>
          )}
          {!loadingLead && !leadData && (
            <Alert>
              <AlertDescription>Não foi possível carregar os dados do seu cadastro. Faça logout e entre novamente.</AlertDescription>
            </Alert>
          )}
          {!loadingLead && leadData && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl">Seu cadastro</CardTitle>
                <CardDescription>Dados do seu cadastro na base</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  {leadData.name != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nome</dt>
                      <dd className="mt-1 text-base font-medium">{String(leadData.name)}</dd>
                    </div>
                  )}
                  {leadData.email != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">E-mail</dt>
                      <dd className="mt-1 text-base">{String(leadData.email)}</dd>
                    </div>
                  )}
                  {leadData.phone != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Telefone</dt>
                      <dd className="mt-1 text-base">{String(leadData.phone)}</dd>
                    </div>
                  )}
                  {leadData.document != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">CPF/CNPJ</dt>
                      <dd className="mt-1 text-base">{String(leadData.document)}</dd>
                    </div>
                  )}
                  {leadData.status != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd className="mt-1">
                        <Badge variant="secondary">{String(leadData.status)}</Badge>
                      </dd>
                    </div>
                  )}
                  {leadData.value != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Valor</dt>
                      <dd className="mt-1 text-base">{Number(leadData.value)}</dd>
                    </div>
                  )}
                  {leadData.score != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Score</dt>
                      <dd className="mt-1 text-base">{Number(leadData.score)}</dd>
                    </div>
                  )}
                  {leadData.custom_fields && typeof leadData.custom_fields === "object" && !Array.isArray(leadData.custom_fields) && (
                    <div className="border-t pt-4 mt-4">
                      <dt className="text-sm font-medium text-muted-foreground mb-2">Campos personalizados</dt>
                      <dd className="mt-1 space-y-2">
                        {Object.entries(leadData.custom_fields as Record<string, unknown>).map(([key, value]) => {
                          const label =
                            key === "datadenascimento"
                              ? "Data de nascimento"
                              : key === "datadaatualizacao"
                                ? "Data da atualização"
                                : key === "datadalista"
                                  ? "Data da lista"
                                  : key === "datadeconclusao"
                                    ? "Data de conclusão"
                                    : key === "statusdoprocesso"
                                      ? "Status do processo"
                                      : key === "observacoes"
                                        ? "Observações"
                                        : key === "responsavel"
                                          ? "Responsável"
                                          : key === "tipodeprocesso"
                                            ? "Tipo de processo"
                                            : key
                          return (
                          <div key={key} className="flex flex-wrap gap-x-2 text-sm">
                            <span className="font-medium text-muted-foreground">{label}:</span>
                            <span>
                              {Array.isArray(value)
                                ? value.join(", ")
                                : typeof value === "object" && value !== null
                                  ? JSON.stringify(value)
                                  : String(value)}
                            </span>
                          </div>
                          )
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
