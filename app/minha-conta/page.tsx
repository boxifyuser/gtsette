"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { LogOut, ChevronDown, ChevronRight } from "lucide-react"

export default function MinhaContaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registerMode, setRegisterMode] = useState(false)
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionCheckDone, setSessionCheckDone] = useState(false)
  const [leadsData, setLeadsData] = useState<Record<string, unknown>[] | null>(null)
  const [loadingLead, setLoadingLead] = useState(false)
  const [sessionUsername, setSessionUsername] = useState<string | null>(null)
  const [cadastroNome, setCadastroNome] = useState("")
  const [cadastroCpf, setCadastroCpf] = useState("")
  const [cadastroEmail, setCadastroEmail] = useState("")
  const [cadastroCnpj, setCadastroCnpj] = useState("")
  const [cadastroLoading, setCadastroLoading] = useState(false)
  const [cadastroSaving, setCadastroSaving] = useState(false)
  const [cadastroError, setCadastroError] = useState("")
  const [cadastroSuccess, setCadastroSuccess] = useState(false)
  const [cadastroLgpdConsent, setCadastroLgpdConsent] = useState(false)
  const [cadastroCompleto, setCadastroCompleto] = useState(false)
  const [expandedProcessoId, setExpandedProcessoId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.session) {
          setIsLoggedIn(true)
          if (data.session.username) setSessionUsername(data.session.username)
        }
      })
      .finally(() => setSessionCheckDone(true))
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    setLoadingLead(true)
    fetch("/api/minha-conta/lead")
      .then((r) => r.json())
      .then((data) => {
        setLeadsData(Array.isArray(data?.leads) ? data.leads : null)
      })
      .catch(() => setLeadsData(null))
      .finally(() => setLoadingLead(false))
  }, [isLoggedIn])

  const formatCpfInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 11)
    return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  const formatCnpjInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 14)
    return n
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }

  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCadastroError("")
    setCadastroSuccess(false)
    setCadastroSaving(true)
    try {
      const res = await fetch("/api/minha-conta/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_completo: cadastroNome.trim(),
          cpf: cadastroCpf.replace(/\D/g, ""),
          email: cadastroEmail.trim(),
          cnpj: cadastroCnpj.trim() ? cadastroCnpj.replace(/\D/g, "") : null,
          lgpd_consent: cadastroLgpdConsent,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCadastroSuccess(true)
        setCadastroCompleto(true)
        fetch("/api/minha-conta/lead")
          .then((r) => r.json())
          .then((d) => setLeadsData(Array.isArray(d?.leads) ? d.leads : null))
          .catch(() => {})
      } else {
        setCadastroError(data.error || "Erro ao salvar cadastro.")
      }
    } catch {
      setCadastroError("Erro de conexão. Tente novamente.")
    } finally {
      setCadastroSaving(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn || !sessionUsername) return
    setCadastroLoading(true)
    fetch("/api/minha-conta/cadastro")
      .then((r) => r.json())
      .then((data) => {
        if (data?.cadastro) {
          const c = data.cadastro
          setCadastroNome(c.nome_completo ?? "")
          setCadastroCpf(c.cpf ? formatCpfInput(c.cpf) : "")
          setCadastroEmail(c.email ?? "")
          setCadastroCnpj(c.cnpj ? formatCnpjInput(c.cnpj) : "")
          setCadastroLgpdConsent(Boolean(c.lgpd_consent))
          const hasRequired = (c.nome_completo ?? "").trim().length >= 2 && (c.cpf ?? "").replace(/\D/g, "").length === 11 && (c.email ?? "").trim().length > 0 && Boolean(c.lgpd_consent)
          setCadastroCompleto(!!hasRequired)
        }
      })
      .catch(() => {})
      .finally(() => setCadastroLoading(false))
  }, [isLoggedIn, sessionUsername])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (!username.trim()) {
      setError("Digite o usuário.")
      setLoading(false)
      return
    }
    if (!password) {
      setError("Digite a senha.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (!username.trim()) {
      setError("Digite o usuário.")
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      setLoading(false)
      return
    }
    if (password !== passwordConfirm) {
      setError("As senhas não coincidem.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsLoggedIn(true)
      } else {
        setError(data.error || "Não foi possível criar a conta.")
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

        {/* Login / Registro */}
        <section className="bg-background px-4 py-16">
          <div className="container mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>{registerMode ? "Criar conta" : "Entrar na sua conta"}</CardTitle>
                <CardDescription>
                  {registerMode
                    ? "Preencha os dados para criar sua conta (auth Neon)."
                    : "Digite usuário e senha para acessar sua área pessoal (auth Neon)."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registerMode ? (
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Usuário</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        autoComplete="username"
                        placeholder="seu_usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={2}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Senha</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password-confirm">Confirmar senha</Label>
                      <Input
                        id="reg-password-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repita a senha"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Criando conta..." : "Criar conta"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Já tem conta?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                        onClick={() => {
                          setRegisterMode(false)
                          setError("")
                        }}
                      >
                        Entrar
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuário</Label>
                      <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="seu_usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <p className="text-center text-sm text-muted-foreground">
                      Não tem conta?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                        onClick={() => {
                          setRegisterMode(true)
                          setError("")
                        }}
                      >
                        Criar conta
                      </button>
                    </p>
                  </form>
                )}
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
              <h1 className="text-2xl font-bold">
                Minha Conta{sessionUsername ? ` — ${sessionUsername}` : ""}
              </h1>
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

      {/* Cadastro (Nome, CPF, E-mail, CNPJ) - apenas para login Neon */}
      {sessionUsername && (
        <section className="border-b bg-muted/30 px-4 py-8">
          <div className="container mx-auto max-w-2xl">
            {!cadastroCompleto && (
              <Alert className="mb-6 border-primary/50 bg-primary/5">
                <AlertDescription>
                  <strong>Complete seu cadastro para ter acesso ao seu processo.</strong> Preencha os dados abaixo e aceite o consentimento LGPD.
                </AlertDescription>
              </Alert>
            )}
            {cadastroCompleto && (
              <Alert className="mb-6 border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200">
                <AlertDescription>
                  <strong>Cadastro completo.</strong> Você pode acompanhar seus processos abaixo.
                </AlertDescription>
              </Alert>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Meu cadastro</CardTitle>
                <CardDescription>
                  Preencha ou atualize seus dados: nome completo, CPF, e-mail e CNPJ (opcional). É necessário aceitar o termo de consentimento LGPD.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cadastroLoading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : (
                  <form onSubmit={handleCadastroSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cadastro-nome">Nome completo</Label>
                      <Input
                        id="cadastro-nome"
                        value={cadastroNome}
                        onChange={(e) => setCadastroNome(e.target.value)}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cadastro-cpf">CPF</Label>
                      <Input
                        id="cadastro-cpf"
                        value={cadastroCpf}
                        onChange={(e) => setCadastroCpf(formatCpfInput(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cadastro-email">E-mail</Label>
                      <Input
                        id="cadastro-email"
                        type="email"
                        value={cadastroEmail}
                        onChange={(e) => setCadastroEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cadastro-cnpj">CNPJ (opcional)</Label>
                      <Input
                        id="cadastro-cnpj"
                        value={cadastroCnpj}
                        onChange={(e) => setCadastroCnpj(formatCnpjInput(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Checkbox
                        id="cadastro-lgpd"
                        checked={cadastroLgpdConsent}
                        onCheckedChange={(v) => setCadastroLgpdConsent(v === true)}
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor="cadastro-lgpd"
                          className="cursor-pointer text-sm font-medium"
                        >
                          Consentimento LGPD
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Declaro que li e concordo com a{" "}
                          <Link href="/privacidade" className="text-primary underline underline-offset-2 hover:no-underline" target="_blank" rel="noopener noreferrer">
                            política de privacidade
                          </Link>{" "}
                          e o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018), para fins de acompanhamento do meu processo.
                        </p>
                      </div>
                    </div>
                    {cadastroError && (
                      <Alert variant="destructive">
                        <AlertDescription>{cadastroError}</AlertDescription>
                      </Alert>
                    )}
                    {cadastroSuccess && (
                      <Alert className="border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200">
                        <AlertDescription><strong>Cadastro completo!</strong> Seus dados foram salvos.</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" disabled={cadastroSaving}>
                      {cadastroSaving ? "Salvando..." : "Salvar cadastro"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Processos: só exibe quando cadastro completo (Neon) ou sempre (Boxify) */}
      <section className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-2xl space-y-6">
          {sessionUsername && !cadastroCompleto && (
            <Alert>
              <AlertDescription>Complete o cadastro acima para ver seus processos.</AlertDescription>
            </Alert>
          )}
          {(!sessionUsername || cadastroCompleto) && loadingLead && (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Carregando seus dados...</p>
            </div>
          )}
          {(!sessionUsername || cadastroCompleto) && !loadingLead && leadsData === null && (
            <Alert>
              <AlertDescription>Não foi possível carregar os dados do seu cadastro. Faça logout e entre novamente.</AlertDescription>
            </Alert>
          )}
          {(!sessionUsername || cadastroCompleto) && !loadingLead && leadsData?.length === 0 && (
            <Alert>
              <AlertDescription>Nenhum processo encontrado para seu cadastro.</AlertDescription>
            </Alert>
          )}
          {!loadingLead && leadsData && leadsData.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Seus processos</h2>
              {leadsData.map((lead, index) => {
                const customFields = lead.custom_fields
                const tipoProcesso = customFields && typeof customFields === "object" && !Array.isArray(customFields)
                  ? (customFields as Record<string, unknown>).tipodeprocesso
                  : null
                const statusProcesso = customFields && typeof customFields === "object" && !Array.isArray(customFields)
                  ? (customFields as Record<string, unknown>).statusdoprocesso
                  : null
                const cardTitle = [String(tipoProcesso || "").trim(), String(statusProcesso || "").trim()].filter(Boolean).join(" — ") || `Processo ${index + 1}`
                const leadId = String(lead.id ?? index)
                const isExpanded = expandedProcessoId === leadId

                return (
                  <Card key={leadId} className="overflow-hidden">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50"
                      onClick={() => setExpandedProcessoId((id) => (id === leadId ? null : leadId))}
                    >
                      <span className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="font-medium">{cardTitle}</span>
                      </span>
                      <Badge variant="secondary" className="shrink-0">
                        {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                      </Badge>
                    </button>
                    {isExpanded && (
                      <CardContent className="border-t bg-muted/20 pt-4">
                        <dl className="space-y-4">
                          {Object.entries(lead).map(([key, value]) => {
                            if (value === undefined) return null
                            const label =
                              key === "name" ? "Nome"
                              : key === "email" ? "E-mail"
                              : key === "phone" ? "Telefone"
                              : key === "document" || key === "document_number" || key === "doc" ? "CPF/CNPJ"
                              : key === "status" ? "Status"
                              : key === "value" ? "Valor"
                              : key === "score" ? "Score"
                              : key === "custom_fields" ? "Dados do processo"
                              : key === "id" ? "ID"
                              : key === "created_at" ? "Criado em"
                              : key === "updated_at" ? "Atualizado em"
                              : key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                            let display: React.ReactNode
                            if (key === "status" && value != null) {
                              display = <Badge variant="secondary">{String(value)}</Badge>
                            } else if (key === "custom_fields" && typeof value === "object" && value !== null && !Array.isArray(value)) {
                              display = (
                                <div className="mt-2 space-y-2 rounded-md border bg-muted/30 p-3">
                                  {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                                    <div key={k} className="flex flex-wrap gap-x-2 text-sm">
                                      <span className="font-medium text-muted-foreground">
                                        {k === "datadenascimento" ? "Data de nascimento" : k === "datadaatualizacao" ? "Data da atualização" : k === "datadalista" ? "Data da lista" : k === "datadeconclusao" ? "Data de conclusão" : k === "statusdoprocesso" ? "Status do processo" : k === "observacoes" ? "Observações" : k === "responsavel" ? "Responsável" : k === "tipodeprocesso" ? "Tipo de processo" : k}:
                                      </span>
                                      <span>
                                        {Array.isArray(v) ? v.join(", ") : typeof v === "object" && v !== null ? JSON.stringify(v) : String(v ?? "")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )
                            } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                              display = <pre className="overflow-x-auto rounded bg-muted/50 p-2 text-xs">{JSON.stringify(value, null, 2)}</pre>
                            } else if (Array.isArray(value)) {
                              display = <pre className="overflow-x-auto rounded bg-muted/50 p-2 text-xs">{JSON.stringify(value, null, 2)}</pre>
                            } else {
                              display = <span className="text-base">{String(value)}</span>
                            }
                            return (
                              <div key={key}>
                                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                                <dd className="mt-1">{display}</dd>
                              </div>
                            )
                          })}
                        </dl>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
