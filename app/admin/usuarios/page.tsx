"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut, User, ArrowRight, Search, Upload, Download, FileSpreadsheet, Trash2, UserPlus } from "lucide-react"
import { sanitizeSituacaoPorOrgao } from "@/lib/situacao-por-orgao"

const PER_PAGE_OPTS = [10, 25, 50, 100] as const
const DEFAULT_PER_PAGE = 50

const BATCH_SIZE = 20

type DbField =
  | "nome_completo"
  | "cpf"
  | "email"
  | "data_nascimento"
  | "telefone"
  | "cnpj"
  | "tipo_processo"
  | "status_processo"
  | "observacoes"
  | "data_atualizacao"
  | "data_conclusao"
const DB_FIELDS: { key: DbField; label: string; required: boolean }[] = [
  { key: "nome_completo", label: "Nome completo", required: true },
  { key: "cpf", label: "CPF", required: true },
  { key: "email", label: "E-mail", required: true },
  { key: "data_nascimento", label: "Data nasc. (AAAA-MM-DD ou DD/MM/AAAA) — primeiro acesso", required: false },
  { key: "telefone", label: "Telefone (DDD+número) — primeiro acesso", required: false },
  { key: "cnpj", label: "CNPJ (opcional)", required: false },
  { key: "tipo_processo", label: "Tipo do processo", required: false },
  { key: "status_processo", label: "Status do processo", required: false },
  { key: "observacoes", label: "Observações", required: false },
  { key: "data_atualizacao", label: "Data atualização (AAAA-MM-DD)", required: false },
  { key: "data_conclusao", label: "Data conclusão (AAAA-MM-DD)", required: false },
]

const ORGAO_MAPPING_PREFIX = "orgao:"

function normalizeHeader(h: string): string {
  return (h ?? "").toString().trim()
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const sep = text.includes(";") ? ";" : ","
  const lines = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  if (lines.length < 2) return { headers: [], rows: [] }
  const rawHeaders = lines[0].split(sep).map((c) => c.replace(/^"|"$/g, "").trim())
  const headers = rawHeaders.map(normalizeHeader)
  const rows = lines.slice(1).map((line) => {
    const parts = line.split(sep).map((p) => p.replace(/^"|"$/g, "").trim())
    return headers.map((_, i) => parts[i] ?? "")
  })
  return { headers, rows }
}

async function parseXLS(file: File): Promise<{ headers: string[]; rows: string[][] }> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: "array" })
  const firstSheet = wb.SheetNames[0]
  if (!firstSheet) return { headers: [], rows: [] }
  const sheet = wb.Sheets[firstSheet]
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: "" }) as string[][]
  if (data.length < 2) return { headers: [], rows: [] }
  const rawHeaders = data[0].map((c) => (c != null ? String(c) : ""))
  const headers = rawHeaders.map(normalizeHeader)
  const rows = data.slice(1).map((row) => headers.map((_, i) => (row[i] != null ? String(row[i]).trim() : "")))
  return { headers, rows }
}

async function parseFile(file: File): Promise<{ headers: string[]; rows: string[][] }> {
  const name = (file.name || "").toLowerCase()
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    return parseXLS(file)
  }
  const text = await file.text()
  return parseCSV(text)
}

function defaultMapping(
  headers: string[],
  orgaos: { nome: string }[],
): Record<string, string | null> {
  const lower = headers.map((h) => h.toLowerCase())
  const find = (...patterns: (string | RegExp)[]) => {
    const i = lower.findIndex((h) => patterns.some((p) => (typeof p === "string" ? h.includes(p) : p.test(h))))
    return i >= 0 ? headers[i]! : null
  }
  const fixed: Record<string, string | null> = {
    nome_completo: find("nome", "name", "full_name", "nome_completo") ?? null,
    cpf: find("cpf", "documento", "doc", "document") ?? null,
    email: find("email", "e-mail", "mail") ?? null,
    data_nascimento: find("data_nascimento", "nascimento", "data nasc", "dt_nasc") ?? null,
    telefone: find("telefone", "fone", "celular", "whatsapp", "tel") ?? null,
    cnpj: find("cnpj") ?? null,
    tipo_processo: find("tipo_processo", "tipo", "processo") ?? null,
    status_processo: find("status_processo", "status", "situação") ?? null,
    observacoes: find("observacoes", "observações", "obs") ?? null,
    data_atualizacao: find("data_atualizacao", "data atualização", "atualizacao") ?? null,
    data_conclusao: find("data_conclusao", "data conclusão", "conclusao") ?? null,
  }
  const orgaoMap: Record<string, string | null> = {}
  orgaos.forEach((o) => {
    const key = ORGAO_MAPPING_PREFIX + o.nome
    orgaoMap[key] = find(o.nome.toLowerCase()) ?? headers.find((h) => h.toLowerCase() === o.nome.toLowerCase()) ?? null
  })
  return { ...fixed, ...orgaoMap }
}

interface UserRow {
  id: string
  username: string
  created_at: string
  nome_completo: string | null
  cpf: string | null
  email: string | null
  cnpj: string | null
}

export default function AdminUsuariosPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminUsername, setAdminUsername] = useState<string | null>(null)
  const [filter, setFilter] = useState("")
  const [filterDebounced, setFilterDebounced] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [parsedSheet, setParsedSheet] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [orgaos, setOrgaos] = useState<{ id: string; nome: string }[]>([])
  const [mapping, setMapping] = useState<Record<string, string | null>>({
    nome_completo: null,
    cpf: null,
    email: null,
    cnpj: null,
    tipo_processo: null,
    status_processo: null,
    observacoes: null,
    data_atualizacao: null,
    data_conclusao: null,
  })
  const [parseError, setParseError] = useState<string | null>(null)
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)
  const [bulkResult, setBulkResult] = useState<{ created: number; errors: { line: number; error: string }[] } | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addNome, setAddNome] = useState("")
  const [addCpf, setAddCpf] = useState("")
  const [addEmail, setAddEmail] = useState("")
  const [addCnpj, setAddCnpj] = useState("")
  const [addSaving, setAddSaving] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.session) {
          router.replace("/admin/login")
          return
        }
        setAdminUsername(data.session.username)
      })
      .catch(() => router.replace("/admin/login"))
  }, [router])

  useEffect(() => {
    const t = setTimeout(() => setFilterDebounced(filter), 300)
    return () => clearTimeout(t)
  }, [filter])

  const loadUsers = useCallback(() => {
    if (!adminUsername) return
    setLoading(true)
    const url = filterDebounced
      ? `/api/admin/users?q=${encodeURIComponent(filterDebounced)}`
      : "/api/admin/users"
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          if (data.error === "Não autorizado.") router.replace("/admin/login")
          else setError(data.error)
          return
        }
        setUsers(Array.isArray(data.users) ? data.users : [])
      })
      .catch(() => setError("Erro ao carregar usuários."))
      .finally(() => setLoading(false))
  }, [adminUsername, filterDebounced, router])

  useEffect(() => {
    if (!adminUsername) return
    loadUsers()
  }, [adminUsername, loadUsers])

  const totalPages = Math.max(1, Math.ceil(users.length / perPage))
  const paginatedUsers = users.slice((page - 1) * perPage, page * perPage)
  const allOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.has(u.id))
  const someSelected = selectedIds.size > 0

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => new Set([...prev, ...paginatedUsers.map((u) => u.id)]))
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginatedUsers.forEach((u) => next.delete(u.id))
        return next
      })
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Excluir ${selectedIds.size} lead(s) selecionado(s)? Esta ação não pode ser desfeita.`)) return
    setDeleting(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSelectedIds(new Set())
        loadUsers()
      }
    } catch {
      setError("Erro ao excluir.")
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!adminUsername) return
    fetch("/api/admin/orgaos")
      .then((r) => r.json())
      .then((data) => setOrgaos(Array.isArray(data?.orgaos) ? data.orgaos : []))
      .catch(() => setOrgaos([]))
  }, [adminUsername])

  useEffect(() => {
    if (!parsedSheet || orgaos.length === 0) return
    setMapping((prev) => {
      const next = { ...prev }
      orgaos.forEach((o) => {
        const key = ORGAO_MAPPING_PREFIX + o.nome
        if (prev[key] === undefined) {
          const lower = parsedSheet.headers.map((h) => h.toLowerCase())
          const idx = lower.findIndex((h) => h.includes(o.nome.toLowerCase()))
          next[key] = idx >= 0 ? parsedSheet.headers[idx]! : null
        }
      })
      return next
    })
  }, [orgaos, parsedSheet])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    const email = addEmail.trim().toLowerCase()
    if (!email) {
      setAddError("E-mail é obrigatório.")
      return
    }
    if (!addNome.trim()) {
      setAddError("Nome completo é obrigatório.")
      return
    }
    const cpfDigits = addCpf.replace(/\D/g, "")
    if (!cpfDigits) {
      setAddError("CPF é obrigatório.")
      return
    }
    setAddSaving(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_completo: addNome.trim(),
          cpf: cpfDigits,
          email,
          cnpj: addCnpj.replace(/\D/g, "") || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.errors?.length > 0) {
        const msg = data.errors?.[0]?.error || data.error || "Não foi possível criar o usuário."
        setAddError(msg)
        return
      }
      setAddOpen(false)
      setAddNome("")
      setAddCpf("")
      setAddEmail("")
      setAddCnpj("")
      loadUsers()
    } catch {
      setAddError("Erro de conexão.")
    } finally {
      setAddSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  if (!adminUsername && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card px-4 py-4">
        <div className="container mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin — Usuários cadastrados</h1>
            <p className="text-sm text-muted-foreground">Logado como {adminUsername}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orgaos">Órgãos</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="lista" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="lista">Lista de usuários</TabsTrigger>
              <TabsTrigger value="importar">Importar em massa</TabsTrigger>
            </TabsList>
            <Button type="button" onClick={() => { setAddError(null); setAddOpen(true) }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar usuário
            </Button>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar usuário</DialogTitle>
                <DialogDescription>
                  Cria um lead com login pelo e-mail e senha padrão (ADMIN_BULK_DEFAULT_PASSWORD). O usuário poderá alterar a senha depois.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                {addError && (
                  <Alert variant="destructive">
                    <AlertDescription>{addError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="add-nome">Nome completo</Label>
                  <Input
                    id="add-nome"
                    value={addNome}
                    onChange={(e) => setAddNome(e.target.value)}
                    placeholder="Nome do lead"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-cpf">CPF</Label>
                  <Input
                    id="add-cpf"
                    value={addCpf}
                    onChange={(e) => setAddCpf(e.target.value)}
                    placeholder="Somente números"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email">E-mail</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="será o usuário de login"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-cnpj">CNPJ (opcional)</Label>
                  <Input
                    id="add-cnpj"
                    value={addCnpj}
                    onChange={(e) => setAddCnpj(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={addSaving}>
                    {addSaving ? "Salvando…" : "Criar usuário"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <TabsContent value="lista" className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filtrar por nome, CPF, e-mail, CNPJ ou número do processo..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
              {!loading && users.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Exibir</span>
                  <Select
                    value={String(perPage)}
                    onValueChange={(v) => { setPerPage(Number(v)); setPage(1) }}
                  >
                    <SelectTrigger className="w-[72px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PER_PAGE_OPTS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">por página</span>
                </div>
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Carregando usuários...</p>
            ) : users.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {filterDebounced ? "Nenhum usuário encontrado com esse filtro." : "Nenhum usuário cadastrado ainda."}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                  <Checkbox
                    id="select-all-leads"
                    checked={allOnPageSelected}
                    onCheckedChange={(c) => handleToggleSelectAll(c === true)}
                    aria-label="Selecionar todos desta página"
                  />
                  <Label htmlFor="select-all-leads" className="cursor-pointer text-sm font-normal">
                    Selecionar todos (desta página)
                  </Label>
                  {someSelected && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deleting}
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleting ? "Excluindo…" : `Excluir (${selectedIds.size})`}
                    </Button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {paginatedUsers.map((u) => (
                    <Card key={u.id} className="overflow-hidden">
                      <CardContent className="flex flex-row items-center gap-3 py-2 pr-2 pl-3 sm:py-2 sm:pr-3">
                        <Checkbox
                          id={`lead-${u.id}`}
                          checked={selectedIds.has(u.id)}
                          onCheckedChange={(c) => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev)
                              if (c === true) next.add(u.id)
                              else next.delete(u.id)
                              return next
                            })
                          }}
                          aria-label={`Selecionar ${u.username}`}
                        />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{u.username}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {[u.nome_completo, u.email].filter(Boolean).join(" · ")}
                            {u.cpf && ` · CPF: ***.${u.cpf.slice(-3)}`}
                            {u.cnpj && ` · CNPJ: ***.${u.cnpj.slice(-4)}`}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="default" className="shrink-0">
                          <Link href={`/admin/usuarios/${u.id}`}>
                            Gerenciar processos
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      {users.length} lead(s) no total · página {page} de {totalPages}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="importar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar leads em massa</CardTitle>
                <CardDescription>
                  Envie uma planilha CSV ou XLS/XLSX. Depois, faça o <strong>De/Para</strong>: associe cada coluna da sua planilha ao campo do sistema (nome, CPF, e-mail, CNPJ).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/users/csv-template", { credentials: "include" })
                      if (!res.ok) return
                      const blob = await res.blob()
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "modelo-leads.csv"
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar modelo CSV
                  </Button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!parsedSheet || !bulkFile) return
                    const { headers, rows } = parsedSheet
                    const getVal = (row: string[], colHeader: string | null) => {
                      if (!colHeader) return ""
                      const idx = headers.indexOf(colHeader)
                      return idx >= 0 ? (row[idx] ?? "").trim() : ""
                    }
                    const payload = rows.map((row) => {
                      const nome = getVal(row, mapping.nome_completo ?? null)
                      const cpfRaw = getVal(row, mapping.cpf ?? null)
                      const email = getVal(row, mapping.email ?? null)
                      const dataNascimento = getVal(row, mapping.data_nascimento ?? null)
                      const telefone = getVal(row, mapping.telefone ?? null)
                      const cnpjRaw = getVal(row, mapping.cnpj ?? null)
                      const tipoProcesso = getVal(row, mapping.tipo_processo ?? null)
                      const statusProcesso = getVal(row, mapping.status_processo ?? null)
                      const observacoes = getVal(row, mapping.observacoes ?? null)
                      const dataAtualizacao = getVal(row, mapping.data_atualizacao ?? null)
                      const dataConclusao = getVal(row, mapping.data_conclusao ?? null)
                      const situacaoPorOrgao: Record<string, string> = {}
                      orgaos.forEach((o) => {
                        const v = getVal(row, mapping[ORGAO_MAPPING_PREFIX + o.nome] ?? null)
                        if (v.trim()) situacaoPorOrgao[o.nome] = v.trim()
                      })
                      const situacaoLimpa = sanitizeSituacaoPorOrgao(situacaoPorOrgao)
                      return {
                        nome_completo: nome,
                        cpf: cpfRaw.replace(/\D/g, ""),
                        email,
                        data_nascimento: dataNascimento || null,
                        telefone: telefone || null,
                        cnpj: cnpjRaw ? cnpjRaw.replace(/\D/g, "") || null : null,
                        tipo_processo: tipoProcesso || null,
                        status_processo: statusProcesso || null,
                        observacoes: observacoes || null,
                        data_atualizacao: dataAtualizacao || null,
                        data_conclusao: dataConclusao || null,
                        situacao_por_orgao: Object.keys(situacaoLimpa).length > 0 ? JSON.stringify(situacaoLimpa) : null,
                      }
                    })
                    setBulkResult(null)
                    setBulkSaving(true)
                    setBulkProgress(0)
                    const total = payload.length
                    let totalCreated = 0
                    const allErrors: { line: number; error: string }[] = []
                    try {
                      for (let i = 0; i < payload.length; i += BATCH_SIZE) {
                        const batch = payload.slice(i, i + BATCH_SIZE)
                        const res = await fetch("/api/admin/users", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(batch),
                        })
                        const data = await res.json()
                        if (data.error) {
                          allErrors.push({ line: i + 1, error: data.error })
                        } else {
                          totalCreated += data.created ?? 0
                          const batchErrors = Array.isArray(data.errors) ? data.errors : []
                          batchErrors.forEach((e: { line: number; error: string }) => {
                            allErrors.push({ line: i + e.line, error: e.error })
                          })
                        }
                        const processed = Math.min(i + BATCH_SIZE, total)
                        setBulkProgress(Math.round((processed / total) * 100))
                      }
                      setBulkResult({ created: totalCreated, errors: allErrors })
                      if (totalCreated > 0) loadUsers()
                    } catch {
                      setBulkResult({ created: 0, errors: [{ line: 0, error: "Erro ao processar arquivo." }] })
                    } finally {
                      setBulkSaving(false)
                      setBulkProgress(0)
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-2">
                    <Label>Escolher arquivo (CSV ou XLS/XLSX)</Label>
                    <Input
                      type="file"
                      accept=".csv,.txt,.xls,.xlsx"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null
                        setBulkFile(file)
                        setBulkResult(null)
                        setParseError(null)
                        setParsedSheet(null)
                        if (!file) return
                        try {
                          const { headers, rows } = await parseFile(file)
                          if (headers.length === 0 || rows.length === 0) {
                            setParseError("Arquivo deve ter cabeçalho e ao menos uma linha de dados.")
                            return
                          }
                          setParsedSheet({ headers, rows })
                          setMapping(defaultMapping(headers, orgaos))
                        } catch (err) {
                          setParseError(err instanceof Error ? err.message : "Erro ao ler o arquivo.")
                        }
                      }}
                    />
                    {parseError && (
                      <Alert variant="destructive">
                        <AlertDescription>{parseError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {parsedSheet && parsedSheet.headers.length > 0 && (
                    <Card className="border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <FileSpreadsheet className="h-4 w-4" />
                          De/Para — mapear colunas da planilha
                        </CardTitle>
                        <CardDescription>
                          Selecione qual coluna da sua planilha corresponde a cada campo do sistema. Campos obrigatórios para importação: Nome completo, CPF e E-mail.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {DB_FIELDS.map(({ key, label, required }) => (
                          <div key={key} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                            <Label className="text-sm">
                              {label}
                              {required && <span className="text-destructive"> *</span>}
                            </Label>
                            <Select
                              value={mapping[key] ?? "__none__"}
                              onValueChange={(v) => setMapping((prev) => ({ ...prev, [key]: v === "__none__" ? null : v }))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="— Não mapear" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">— Não mapear</SelectItem>
                                {parsedSheet.headers.map((h) => (
                                  <SelectItem key={h} value={h}>
                                    {h || "(vazio)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                        {orgaos.length > 0 && (
                          <>
                            <p className="text-sm font-medium text-muted-foreground">Situação por órgão (uma coluna por órgão)</p>
                            {orgaos.map((o) => {
                              const key = ORGAO_MAPPING_PREFIX + o.nome
                              return (
                                <div key={key} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                                  <Label className="text-sm">{o.nome}</Label>
                                  <Select
                                    value={mapping[key] ?? "__none__"}
                                    onValueChange={(v) => setMapping((prev) => ({ ...prev, [key]: v === "__none__" ? null : v }))}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="— Não mapear" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__">— Não mapear</SelectItem>
                                      {parsedSheet.headers.map((h) => (
                                        <SelectItem key={h} value={h}>
                                          {h || "(vazio)"}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )
                            })}
                          </>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {parsedSheet.rows.length} linha(s) serão importadas.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {bulkSaving && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Importando…</span>
                        <span className="font-medium tabular-nums">{bulkProgress}%</span>
                      </div>
                      <Progress value={bulkProgress} className="h-2.5" />
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={!parsedSheet || parsedSheet.rows.length === 0 || bulkSaving || !mapping.nome_completo || !mapping.cpf || !mapping.email}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {bulkSaving ? `Importando… ${bulkProgress}%` : "Importar planilha"}
                  </Button>
                </form>
                {bulkResult && (
                  <Alert>
                    <AlertDescription>
                      <strong>Importação concluída:</strong> {bulkResult.created} lead(s) criado(s).
                      {bulkResult.errors.length > 0 && (
                        <ul className="mt-2 list-inside list-disc text-sm">
                          {bulkResult.errors.slice(0, 10).map((e, i) => (
                            <li key={i}>Linha {e.line}: {e.error}</li>
                          ))}
                          {bulkResult.errors.length > 10 && (
                            <li>… e mais {bulkResult.errors.length - 10} erro(s)</li>
                          )}
                        </ul>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
