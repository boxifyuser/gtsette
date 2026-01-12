"use client"

import { useState } from "react"
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
  const [cpf, setCpf] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<ProcessStatus | "todos">("todos")
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)

  // Mock data - em produção viria de uma API
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
    if (/^(\d)\1+$/.test(numbers)) return false

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validação
    if (!validateCPF(cpf)) {
      setError("CPF inválido. Por favor, verifique os dados.")
      setLoading(false)
      return
    }

    if (birthDate.replace(/\D/g, "").length !== 8) {
      setError("Data de nascimento inválida. Use o formato DD/MM/AAAA.")
      setLoading(false)
      return
    }

    // Validação do CPF de teste
    const cpfNumbers = cpf.replace(/\D/g, "")
    const testCPF = "10585847665"
    const testDate = "28/09/1994"

    if (cpfNumbers === testCPF && birthDate === testDate) {
      // Simulação de chamada à API
      setTimeout(() => {
        setIsLoggedIn(true)
        setSelectedProcess(processes[0]?.id || null)
        setLoading(false)
      }, 1000)
    } else {
      setError("CPF ou data de nascimento incorretos. Use o CPF de teste: 105.858.476-65 e data: 28/09/1994")
      setLoading(false)
    }
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
                  Digite seu CPF e data de nascimento para acessar sua área pessoal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
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
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
                <div className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  <p className="font-semibold">Dados de teste:</p>
                  <p>CPF: 105.858.476-65</p>
                  <p>Data de Nascimento: 28/09/1994</p>
                </div>
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
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Processos */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl font-bold">PROCESSOS</h2>
                <p className="text-sm text-muted-foreground">
                  Veja abaixo as listas em andamento, 100% baixadas ou em reprotocolo. Clique em uma lista para
                  visualizar detalhes por órgão.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {(["todos", "em-andamento", "100-baixado", "reprotocolo"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={
                      selectedFilter === filter
                        ? "bg-primary text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {filter === "todos" && "Todos"}
                    {filter === "em-andamento" && (
                      <>
                        <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
                        Em andamento
                      </>
                    )}
                    {filter === "100-baixado" && (
                      <>
                        <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                        100% baixado
                      </>
                    )}
                    {filter === "reprotocolo" && (
                      <>
                        <div className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
                        Reprotocolo
                      </>
                    )}
                  </Button>
                ))}
              </div>

              {/* Process List */}
              <div className="space-y-3">
                {filteredProcesses.map((process) => (
                  <Card
                    key={process.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProcess === process.id ? "border-primary border-2 bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedProcess(process.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="mb-1 text-sm font-semibold text-muted-foreground">{process.date}</p>
                          <p className="mb-2 font-semibold">Processo coletivo</p>
                          <div className="mb-2">{getStatusBadge(process.status)}</div>
                          <p className="text-xs text-muted-foreground">Atualizado: {process.lastUpdate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Legend */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="mb-2 text-sm font-semibold">Legenda:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Em andamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>100% baixado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Reprotocolo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Process Details */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl font-bold">Lista {currentProcess?.date}</h2>
                <p className="text-sm text-muted-foreground">
                  Visualize abaixo o resumo do processo coletivo dessa lista e a situação em cada órgão.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Última atualização {currentProcess?.lastUpdate}
                </p>
              </div>

              {/* Process Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do processo desta lista</CardTitle>
                  <CardDescription>STATUS GERAL</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(currentProcess?.status || "em-andamento")}
                    <span className="text-sm font-semibold">
                      PROCESSO COLETIVO - LISTA {currentProcess?.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    As informações acima refletem o status global desta lista na operação coletiva. Detalhes por
                    órgão, com descrição e datas, estão disponibilizados abaixo.
                  </p>
                </CardContent>
              </Card>

              {/* Situation by Organ */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Situação por órgão</h3>
                <div className="mb-4 flex flex-wrap gap-2 text-sm font-medium text-muted-foreground">
                  {Object.keys(currentProcess?.organs || {}).map((key) => {
                    const organNames: Record<string, string> = {
                      serasa: "SERASA",
                      spc: "SPC",
                      boaVista: "BOA VISTA",
                      cenprotSP: "CENPROT SP",
                      cenprotNacional: "CENPROT NACIONAL",
                      outros: "OUTROS",
                    }
                    return (
                      <span key={key} className="cursor-pointer hover:text-primary">
                        {organNames[key] || key.toUpperCase()}
                      </span>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  {currentProcess?.organs.serasa && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">SERASA</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.serasa.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.serasa.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                        {currentProcess.organs.serasa.warning && (
                          <Alert className="mt-3 border-amber-500 bg-amber-50">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800">
                              {currentProcess.organs.serasa.warning}
                            </AlertDescription>
                          </Alert>
                        )}
                        {currentProcess.organs.serasa.lastProtocol && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Último protocolo enviado: {currentProcess.organs.serasa.lastProtocol}
                          </p>
                        )}
                        {currentProcess.organs.serasa.received && (
                          <p className="text-xs text-muted-foreground">
                            Recepcionado: {currentProcess.organs.serasa.received}
                          </p>
                        )}
                        {currentProcess.organs.serasa.started && (
                          <p className="text-xs text-muted-foreground">
                            Baixas iniciadas: {currentProcess.organs.serasa.started}
                          </p>
                        )}
                        {currentProcess.organs.serasa.completed && (
                          <p className="text-xs text-muted-foreground">
                            Baixas concluídas: {currentProcess.organs.serasa.completed}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentProcess?.organs.spc && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">SPC</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.spc.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.spc.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                        {currentProcess.organs.spc.completed && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Baixas concluídas: {currentProcess.organs.spc.completed}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentProcess?.organs.boaVista && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">BOA VISTA</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.boaVista.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.boaVista.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                        {currentProcess.organs.boaVista.completed && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Baixas concluídas: {currentProcess.organs.boaVista.completed}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentProcess?.organs.cenprotSP && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">CENPROT SP</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.cenprotSP.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.cenprotSP.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                        {currentProcess.organs.cenprotSP.lastProtocol && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Último protocolo enviado: {currentProcess.organs.cenprotSP.lastProtocol}
                          </p>
                        )}
                        {currentProcess.organs.cenprotSP.received && (
                          <p className="text-xs text-muted-foreground">
                            Recepcionado: {currentProcess.organs.cenprotSP.received}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentProcess?.organs.cenprotNacional && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">CENPROT NACIONAL</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.cenprotNacional.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.cenprotNacional.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                        {currentProcess.organs.cenprotNacional.lastProtocol && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Último protocolo enviado: {currentProcess.organs.cenprotNacional.lastProtocol}
                          </p>
                        )}
                        {currentProcess.organs.cenprotNacional.received && (
                          <p className="text-xs text-muted-foreground">
                            Recepcionado: {currentProcess.organs.cenprotNacional.received}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentProcess?.organs.outros && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">OUTROS</CardTitle>
                          {getOrganStatusBadge(currentProcess.organs.outros.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        {currentProcess.organs.outros.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
