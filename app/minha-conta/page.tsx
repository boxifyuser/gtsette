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
import { LogOut, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [editingCadastro, setEditingCadastro] = useState(false)
  const [expandedProcessoId, setExpandedProcessoId] = useState<string | null>(null)
  type ProcessoFilter = "todos" | "em_andamento" | "100_baixado" | "reprotocolo"
  const [processoFilter, setProcessoFilter] = useState<ProcessoFilter>("todos")
  const [orgaos, setOrgaos] = useState<{ id: string; nome: string; ordem: number; ativo: boolean }[]>([])
  const [primeiroAcessoOpen, setPrimeiroAcessoOpen] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [paCpf, setPaCpf] = useState("")
  const [paDataNasc, setPaDataNasc] = useState("")
  const [paEmail, setPaEmail] = useState("")
  const [paTelefone, setPaTelefone] = useState("")
  const [paLoading, setPaLoading] = useState(false)
  const [paError, setPaError] = useState("")
  const [paSuccess, setPaSuccess] = useState("")
  const [paWhatsappUrl, setPaWhatsappUrl] = useState<string | null>(null)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState("")

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

  useEffect(() => {
    if (!isLoggedIn) return
    fetch("/api/orgaos")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.orgaos) ? data.orgaos : []
        setOrgaos(list.filter((o: { nome: string }) => o.nome?.trim() !== "Outros"))
      })
      .catch(() => setOrgaos([]))
  }, [isLoggedIn])

  const formatCpfInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 11)
    return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  /** Máscara DD/MM/AAAA */
  const formatDataNascimentoInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 8)
    if (n.length <= 2) return n
    if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`
    return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`
  }
  /** Máscara (00) 00000-0000 */
  const formatTelefoneInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 11)
    if (n.length <= 2) return n.length ? `(${n}` : ""
    if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`
    if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  }
  /** E-mail em minúsculas, sem máscara visual além do type email */
  const formatCnpjInput = (value: string) => {
    const n = value.replace(/\D/g, "").slice(0, 14)
    return n
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }

  /** Normaliza o status do processo para filtro e exibição (em_andamento | 100_baixado | reprotocolo). */
  const normalizeStatusProcesso = (status: string | null | undefined): ProcessoFilter | null => {
    const s = String(status ?? "").toLowerCase().trim()
    if (!s) return null
    if (s.includes("reprotocolo") || s.includes("re-protocolo")) return "reprotocolo"
    if (s.includes("100") || s.includes("baixado") || s.includes("concluído") || s.includes("concluido")) return "100_baixado"
    if (s.includes("andamento") || s.includes("em andamento")) return "em_andamento"
    return "em_andamento"
  }

  const formatProcessoDate = (value: string | Date | null | undefined): string => {
    if (value == null) return ""
    const d = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(d.getTime())) return ""
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const formatProcessoDateTime = (value: string | Date | null | undefined): string => {
    if (value == null) return ""
    const d = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(d.getTime())) return ""
    const s = d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    return s.replace(/,?\s+/, " às ")
  }

  /** Retorna classes CSS para o badge de status por órgão (cores distintas por tipo). */
  const statusOrgaoBadgeClass = (statusLabel: string): string => {
    const s = statusLabel.toLowerCase().trim()
    if (!s || s === "—") return "border-border bg-muted/50 text-muted-foreground"
    if (s.includes("100") || s.includes("baixado") || s.includes("concluído") || s.includes("concluido"))
      return "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200"
    if (s.includes("andamento") || s.includes("em andamento"))
      return "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-200"
    if (s.includes("aguardando") || s.includes("início") || s.includes("inicio") || s.includes("baixas"))
      return "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200"
    return "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
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
        setEditingCadastro(false)
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

  const handlePrimeiroAcesso = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaError("")
    setPaSuccess("")
    setPaWhatsappUrl(null)
    setPaLoading(true)
    try {
      const res = await fetch("/api/minha-conta/primeiro-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: paCpf,
          dataNascimento: paDataNasc,
          email: paEmail.trim().toLowerCase(),
          telefone: paTelefone,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPaSuccess(data.message || "Verifique seu e-mail.")
        if (data.whatsappUrl) setPaWhatsappUrl(data.whatsappUrl)
      } else {
        setPaError(data.error || "Não foi possível concluir.")
        if (data.whatsappUrl) setPaWhatsappUrl(data.whatsappUrl)
      }
    } catch {
      setPaError("Erro de conexão. Tente novamente.")
    } finally {
      setPaLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotMessage("")
    setForgotLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      })
      const data = await res.json()
      setForgotMessage(data.message || data.error || "Tente novamente.")
      if (data.success) setForgotEmail("")
    } catch {
      setForgotMessage("Erro de conexão.")
    } finally {
      setForgotLoading(false)
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
                    ? "Defina usuário e senha para acessar a área do cliente."
                    : "Use seu e-mail ou telefone com DDD e senha. Primeiro acesso? Use o botão abaixo."}
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
                      <Label htmlFor="username">E-mail ou telefone (com DDD)</Label>
                      <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="seu@email.com ou (31) 99999-9999"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <button
                          type="button"
                          className="text-xs font-medium text-primary underline underline-offset-2 hover:no-underline"
                          onClick={() => {
                            setForgotOpen(true)
                            setForgotMessage("")
                          }}
                        >
                          Esqueci minha senha
                        </button>
                      </div>
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
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPrimeiroAcessoOpen(true)
                          setPaError("")
                          setPaSuccess("")
                          setPaWhatsappUrl(null)
                        }}
                      >
                        Primeiro acesso?
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
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Primeiro acesso: valida cadastro e envia senha por e-mail */}
            <Dialog open={primeiroAcessoOpen} onOpenChange={setPrimeiroAcessoOpen}>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Primeiro acesso</DialogTitle>
                  <DialogDescription>
                    Informe os mesmos dados do seu cadastro. Se tudo conferir, enviaremos uma senha para o seu e-mail.
                    A recuperação de senha também é feita por e-mail.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePrimeiroAcesso} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pa-cpf">CPF</Label>
                    <Input
                      id="pa-cpf"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      value={paCpf}
                      onChange={(e) => setPaCpf(formatCpfInput(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-nasc">Data de nascimento</Label>
                    <Input
                      id="pa-nasc"
                      inputMode="numeric"
                      placeholder="DD/MM/AAAA"
                      value={paDataNasc}
                      onChange={(e) => setPaDataNasc(formatDataNascimentoInput(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-email">E-mail</Label>
                    <Input
                      id="pa-email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={paEmail}
                      onChange={(e) => setPaEmail(e.target.value.toLowerCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-tel">Telefone com DDD</Label>
                    <Input
                      id="pa-tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(31) 99999-9999"
                      value={paTelefone}
                      onChange={(e) => setPaTelefone(formatTelefoneInput(e.target.value))}
                      required
                    />
                  </div>
                  {paError && (
                    <Alert variant="destructive">
                      <AlertDescription>{paError}</AlertDescription>
                    </Alert>
                  )}
                  {paSuccess && (
                    <Alert>
                      <AlertDescription>{paSuccess}</AlertDescription>
                    </Alert>
                  )}
                  {paWhatsappUrl && (
                    <p className="text-sm text-muted-foreground">
                      <a
                        href={paWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline"
                      >
                        Falar no WhatsApp +55 31 98250-6478
                      </a>
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={paLoading}>
                    {paLoading ? "Verificando..." : "Validar e receber senha por e-mail"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Esqueci senha: envia nova senha por e-mail (Resend) */}
            <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Recuperar senha</DialogTitle>
                  <DialogDescription>
                    Informe o e-mail do seu cadastro. Se existir, enviaremos uma nova senha para esse e-mail.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">E-mail</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  {forgotMessage && (
                    <Alert variant={forgotMessage.includes("Erro") ? "destructive" : "default"}>
                      <AlertDescription>{forgotMessage}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={forgotLoading}>
                    {forgotLoading ? "Enviando..." : "Enviar nova senha por e-mail"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
            {!cadastroCompleto && !editingCadastro && (
              <Alert className="mb-6 border-primary/50 bg-primary/5">
                <AlertDescription>
                  <strong>Complete seu cadastro para ter acesso ao seu processo.</strong> Preencha os dados abaixo e aceite o consentimento LGPD.
                </AlertDescription>
              </Alert>
            )}
            {cadastroCompleto && !editingCadastro && (
              <>
                <Alert className="mb-4 border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200">
                  <AlertDescription>
                    <strong>Cadastro completo.</strong> Você pode acompanhar seus processos abaixo.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => setEditingCadastro(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar cadastro
                </Button>
              </>
            )}
            {(editingCadastro || !cadastroCompleto) && (
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
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={cadastroSaving}>
                          {cadastroSaving ? "Salvando..." : "Salvar cadastro"}
                        </Button>
                        {cadastroCompleto && (
                          <Button type="button" variant="ghost" onClick={() => setEditingCadastro(false)}>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
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
          {!loadingLead && leadsData && leadsData.length > 0 && (() => {
            const customFieldsOf = (lead: Record<string, unknown>) =>
              lead.custom_fields && typeof lead.custom_fields === "object" && !Array.isArray(lead.custom_fields)
                ? (lead.custom_fields as Record<string, unknown>)
                : null
            const filteredLeads = leadsData.filter((lead) => {
              if (processoFilter === "todos") return true
              const cf = customFieldsOf(lead)
              const status = cf?.statusdoprocesso != null ? String(cf.statusdoprocesso) : null
              const normalized = normalizeStatusProcesso(status)
              return normalized === processoFilter
            })

            const statusConfig: Record<ProcessoFilter, { label: string; dotClass: string; pillClass: string; displayText: string }> = {
              todos: { label: "Todos", dotClass: "bg-muted-foreground", pillClass: "", displayText: "" },
              em_andamento: { label: "Em andamento", dotClass: "bg-blue-500", pillClass: "bg-blue-100 text-blue-800 border-blue-200", displayText: "EM ANDAMENTO" },
              "100_baixado": { label: "100% baixado", dotClass: "bg-green-500", pillClass: "bg-green-100 text-green-800 border-green-200", displayText: "100% BAIXADO" },
              reprotocolo: { label: "Reprotocolo", dotClass: "bg-amber-500", pillClass: "bg-amber-100 text-amber-800 border-amber-200", displayText: "REPROTOCOLO" },
            }

            return (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Seus processos</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Veja abaixo as listas em andamento, 100% baixadas ou em reprotocolo. Clique em uma lista para visualizar detalhes.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["todos", "em_andamento", "100_baixado", "reprotocolo"] as const).map((key) => {
                    const cfg = statusConfig[key]
                    const isSelected = processoFilter === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setProcessoFilter(key)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-amber-400 bg-amber-50 text-amber-900"
                            : "border-border bg-background text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  {filteredLeads.map((lead, index) => {
                    const cf = customFieldsOf(lead)
                    const tipoProcesso = cf?.tipodeprocesso != null ? String(cf.tipodeprocesso) : ""
                    const statusProcesso = cf?.statusdoprocesso != null ? String(cf.statusdoprocesso) : null
                    const dataAtualizacao = cf?.datadaatualizacao ?? lead.updated_at ?? lead.created_at
                    const normalizedStatus = normalizeStatusProcesso(statusProcesso) ?? "em_andamento"
                    const cfg = statusConfig[normalizedStatus]
                    const dataPrincipal = cf?.datadaatualizacao ?? lead.created_at
                    const leadId = String(lead.id ?? index)
                    const isExpanded = expandedProcessoId === leadId
                    const isSelected = isExpanded

                    return (
                      <Card
                        key={leadId}
                        className={`overflow-hidden transition-colors ${isSelected ? "ring-2 ring-amber-200 bg-amber-50/30" : ""}`}
                      >
                        <button
                          type="button"
                          className="flex w-full flex-col gap-1 p-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                          onClick={() => setExpandedProcessoId((id) => (id === leadId ? null : leadId))}
                        >
                          <div className="flex flex-1 flex-col gap-0.5">
                            <div className="flex items-baseline gap-2">
                              <span className="font-semibold">
                                {index + 1}. {formatProcessoDate(dataPrincipal)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {tipoProcesso.trim() || "Processo coletivo"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 sm:items-end">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.pillClass}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                              {cfg.displayText || (statusProcesso ? String(statusProcesso).toUpperCase() : "—")}
                            </span>
                            {dataAtualizacao && (
                              <span className="text-xs text-muted-foreground">
                                {formatProcessoDateTime(dataAtualizacao)}
                              </span>
                            )}
                          </div>
                        </button>
                        {isExpanded && (
                          <CardContent className="border-t bg-muted/20 pt-4">
                            <div className="space-y-6">
                              {lead.id != null && (
                                <div>
                                  <dt className="text-sm font-semibold text-foreground">ID</dt>
                                  <dd className="mt-1 break-all font-mono text-sm text-muted-foreground">{String(lead.id)}</dd>
                                </div>
                              )}
                              {(() => {
                                const cf = customFieldsOf(lead)
                                if (!cf) return null
                                const labels: Record<string, string> = {
                                  tipodeprocesso: "Tipo de processo",
                                  statusdoprocesso: "Status do processo",
                                  observacoes: "Observações",
                                  datadaatualizacao: "Data da atualização",
                                  datadeconclusao: "Data de conclusão",
                                  datadenascimento: "Data de nascimento",
                                  datadalista: "Data da lista",
                                  responsavel: "Responsável",
                                }
                                const formatCfValue = (v: unknown): string => {
                                  if (v == null) return ""
                                  const asDate = typeof v === "string" || typeof v === "number" || v instanceof Date
                                  if (asDate) {
                                    const d = v instanceof Date ? v : new Date(v as string | number)
                                    if (!Number.isNaN(d.getTime()))
                                      return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(/,?\s+/, " às ")
                                  }
                                  return Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v)
                                }
                                return (
                                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                                    <h3 className="mb-3 text-sm font-semibold text-foreground">Dados do processo</h3>
                                    <dl className="space-y-2">
                                      {Object.entries(cf).map(([k, v]) => (
                                        <div key={k} className="text-sm">
                                          <span className="font-medium text-muted-foreground">{labels[k] || k}:</span>{" "}
                                          <span className="text-foreground">{formatCfValue(v)}</span>
                                        </div>
                                      ))}
                                    </dl>
                                  </div>
                                )
                              })()}
                              <dl className="space-y-1 text-sm">
                                {lead.created_at != null && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">Criado em:</span>{" "}
                                    <span>{formatProcessoDateTime(lead.created_at)}</span>
                                  </div>
                                )}
                                {lead.updated_at != null && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">Atualizado em:</span>{" "}
                                    <span>{formatProcessoDateTime(lead.updated_at)}</span>
                                  </div>
                                )}
                              </dl>
                              {orgaos.length > 0 && (
                                <div>
                                  <h3 className="mb-2 text-sm font-semibold text-foreground">Situação por órgão</h3>
                                  <p className="mb-3 text-xs text-muted-foreground">
                                    {orgaos.map((o) => o.nome).join(" · ")}
                                  </p>
                                  <div className="flex flex-col gap-3">
                                    {orgaos.map((orgao) => {
                                      const situacao = (lead.situacao_por_orgao && typeof lead.situacao_por_orgao === "object" && !Array.isArray(lead.situacao_por_orgao)
                                        ? (lead.situacao_por_orgao as Record<string, string>)[orgao.nome]
                                        : null) || null
                                      const statusLabel = situacao || "—"
                                      return (
                                        <div
                                          key={orgao.id}
                                          className="rounded-lg border border-border bg-card p-4 shadow-sm"
                                        >
                                          <div className="flex flex-wrap items-start justify-between gap-2">
                                            <span className="font-semibold uppercase tracking-tight text-foreground">
                                              {orgao.nome}
                                            </span>
                                            <span
                                              className={`inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${statusOrgaoBadgeClass(statusLabel)}`}
                                            >
                                              {statusLabel}
                                            </span>
                                          </div>
                                          <p className="mt-2 text-xs text-muted-foreground">
                                            As informações detalhadas sobre este órgão serão atualizadas aqui pela coordenação.
                                          </p>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Em andamento
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> 100% baixado
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Reprotocolo
                  </span>
                </div>
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
