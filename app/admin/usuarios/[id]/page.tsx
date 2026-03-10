"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LogOut, ArrowLeft, Plus, Pencil, Trash2, Upload } from "lucide-react"
import { sanitizeSituacaoPorOrgao } from "@/lib/situacao-por-orgao"

interface Processo {
  id: string
  user_id: string
  tipo_processo: string | null
  status_processo: string | null
  observacoes: string | null
  data_atualizacao: string | null
  data_conclusao: string | null
  situacao_por_orgao: Record<string, string> | null
  created_at: string
  updated_at: string
}

const ORGAO_STATUS_OPCOES = [
  "",
  "Aguardando início das baixas",
  "Em Andamento",
  "100% baixado",
] as const

/** Tipos fixos para o campo "Tipo do processo" em admin/usuários */
const TIPO_PROCESSO_OPCOES = ["Limpeza de CPF", "Limpeza de CNPJ"] as const

/** Status fixos para o campo "Status do processo" (alinhado à situação por órgão) */
const STATUS_PROCESSO_OPCOES = [
  "Aguardando início das baixas",
  "Em Andamento",
  "100% baixado",
] as const

/** Converte qualquer valor de data para yyyy-MM-dd (exigido por input type="date"). */
function toDateInputValue(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") return ""
  const s = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Formata data para exibição simples (dd/MM/yyyy). */
function formatDateDisplay(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") return "—"
  const s = String(value).trim()
  const d = /^\d{4}-\d{2}-\d{2}/.test(s) ? new Date(s.slice(0, 10)) : new Date(s)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

interface UserInfo {
  id: string
  username: string
  nome_completo: string | null
  email: string | null
  cpf: string | null
}

export default function AdminUsuarioDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<UserInfo | null>(null)
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminUsername, setAdminUsername] = useState<string | null>(null)

  const [showNewForm, setShowNewForm] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formTipo, setFormTipo] = useState("")
  const [formStatus, setFormStatus] = useState("")
  const [formObs, setFormObs] = useState("")
  const [formDataAtual, setFormDataAtual] = useState("")
  const [formDataConc, setFormDataConc] = useState("")
  const [formSituacaoPorOrgao, setFormSituacaoPorOrgao] = useState<Record<string, string>>({})
  const [orgaos, setOrgaos] = useState<{ id: string; nome: string; ordem: number; ativo: boolean }[]>([])
  const [bulkText, setBulkText] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const loadSession = useCallback(() => {
    return fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.session) {
          router.replace("/admin/login")
          return null
        }
        setAdminUsername(data.session.username)
        return data.session
      })
  }, [router])

  const loadUsersAndProcessos = useCallback(() => {
    return fetch("/api/admin/users")
      .then((r) => r.json())
      .then((usersData) => {
        const users = usersData.users || []
        const u = users.find((x: UserInfo) => x.id === userId)
        if (!u) {
          setError("Usuário não encontrado.")
          return
        }
        setUser({ id: u.id, username: u.username, nome_completo: u.nome_completo, email: u.email, cpf: u.cpf })
      })
      .then(() => fetch(`/api/admin/users/${userId}/processos`))
      .then((r) => r.json())
      .then((data) => setProcessos(data.processos || []))
      .catch(() => setError("Erro ao carregar dados."))
  }, [userId])

  useEffect(() => {
    loadSession().then((session) => {
      if (session) loadUsersAndProcessos().finally(() => setLoading(false))
    })
  }, [loadSession, loadUsersAndProcessos])

  useEffect(() => {
    fetch("/api/admin/orgaos")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.orgaos) ? data.orgaos : []
        // "Outros" retirado da situação por órgão
        setOrgaos(list.filter((o: { nome: string }) => o.nome?.trim() !== "Outros"))
      })
      .catch(() => setOrgaos([]))
  }, [])

  const resetForm = () => {
    setFormTipo("")
    setFormStatus("")
    setFormObs("")
    setFormDataAtual("")
    setFormDataConc("")
    setFormSituacaoPorOrgao({})
    setEditingId(null)
    setShowNewForm(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/users/${userId}/processos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_processo: formTipo || null,
          status_processo: formStatus || null,
          observacoes: formObs || null,
          data_atualizacao: formDataAtual ? toDateInputValue(formDataAtual) || null : null,
          data_conclusao: formDataConc ? toDateInputValue(formDataConc) || null : null,
          situacao_por_orgao: sanitizeSituacaoPorOrgao(
            Object.fromEntries(
              Object.entries(formSituacaoPorOrgao).filter(([, v]) => v != null && String(v).trim() !== "")
            )
          ),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Processo criado.")
        resetForm()
        loadUsersAndProcessos()
      } else setMessage(data.error || "Erro ao criar.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/processos/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_processo: formTipo || null,
          status_processo: formStatus || null,
          observacoes: formObs || null,
          data_atualizacao: formDataAtual ? toDateInputValue(formDataAtual) || null : null,
          data_conclusao: formDataConc ? toDateInputValue(formDataConc) || null : null,
          situacao_por_orgao: sanitizeSituacaoPorOrgao(
            Object.fromEntries(
              Object.entries(formSituacaoPorOrgao).filter(([, v]) => v != null && String(v).trim() !== "")
            )
          ),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Processo atualizado.")
        resetForm()
        loadUsersAndProcessos()
      } else setMessage(data.error || "Erro ao atualizar.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este processo?")) return
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/processos/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setMessage("Processo excluído.")
        loadUsersAndProcessos()
      } else setMessage(data.error || "Erro ao excluir.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (p: Processo) => {
    setEditingId(p.id)
    setFormTipo(p.tipo_processo || "")
    setFormStatus(p.status_processo || "")
    setFormObs(p.observacoes || "")
    setFormDataAtual(toDateInputValue(p.data_atualizacao))
    setFormDataConc(toDateInputValue(p.data_conclusao))
    setFormSituacaoPorOrgao(
      sanitizeSituacaoPorOrgao(
        p.situacao_por_orgao && typeof p.situacao_por_orgao === "object" ? { ...p.situacao_por_orgao } : {}
      )
    )
    setShowNewForm(false)
    setShowBulk(false)
  }

  const handleBulk = async (e: React.FormEvent) => {
    e.preventDefault()
    const lines = bulkText.split("\n").map((s) => s.trim()).filter(Boolean)
    const items = lines.map((line) => {
      const parts = line.split(";").map((s) => s.trim())
      return {
        tipo_processo: parts[0] || null,
        status_processo: parts[1] || null,
        observacoes: parts[2] || null,
        data_atualizacao: parts[3] || null,
        data_conclusao: parts[4] || null,
      }
    })
    if (items.length === 0) {
      setMessage("Informe ao menos uma linha no formato: tipo;status;observações;data_atualizacao(YYYY-MM-DD);data_conclusao(YYYY-MM-DD)")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/users/${userId}/processos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`Criados: ${data.created}. Atualizados: ${data.updated}.`)
        setBulkText("")
        setShowBulk(false)
        loadUsersAndProcessos()
      } else setMessage(data.error || "Erro na importação.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  if (loading || !adminUsername) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card px-4 py-4">
        <div className="container mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/usuarios" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Voltar aos usuários
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orgaos">Órgãos</Link>
              </Button>
            </div>
            <h1 className="mt-2 text-xl font-bold">Processos do usuário</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                {user.username}
                {user.nome_completo && ` — ${user.nome_completo}`}
                {user.email && ` · ${user.email}`}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={showNewForm ? "secondary" : "default"}
            size="sm"
            onClick={() => {
              if (showNewForm) {
                resetForm()
              } else {
                setShowBulk(false)
                setFormTipo("")
                setFormStatus("")
                setFormObs("")
                setFormDataAtual("")
                setFormDataConc("")
                setFormSituacaoPorOrgao({})
                setEditingId(null)
                setShowNewForm(true)
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo processo
          </Button>
          <Button
            variant={showBulk ? "secondary" : "outline"}
            size="sm"
            onClick={() => { setShowBulk(!showBulk); setShowNewForm(false); resetForm(); }}
          >
            <Upload className="mr-2 h-4 w-4" /> Subir em massa
          </Button>
        </div>

        {(showNewForm || editingId) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? "Editar processo" : "Criar processo"}</CardTitle>
              <CardDescription>Preencha os campos. Datas no formato AAAA-MM-DD.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo do processo</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value)}
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPO_PROCESSO_OPCOES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {/* Processos antigos com outro texto: mantém editável sem perder o valor */}
                    {formTipo &&
                      !(TIPO_PROCESSO_OPCOES as readonly string[]).includes(formTipo) && (
                        <option value={formTipo}>{formTipo} (valor atual)</option>
                      )}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status do processo</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <option value="">Selecione o status</option>
                    {STATUS_PROCESSO_OPCOES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {formStatus &&
                      !(STATUS_PROCESSO_OPCOES as readonly string[]).includes(formStatus) && (
                        <option value={formStatus}>{formStatus} (valor atual)</option>
                      )}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Observações</Label>
                  <Input value={formObs} onChange={(e) => setFormObs(e.target.value)} placeholder="Observações" />
                </div>
                <div className="space-y-2">
                  <Label>Data atualização</Label>
                  <Input type="date" value={formDataAtual} onChange={(e) => setFormDataAtual(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Data conclusão</Label>
                  <Input type="date" value={formDataConc} onChange={(e) => setFormDataConc(e.target.value)} />
                </div>
                {orgaos.length > 0 && (
                  <div className="space-y-3 sm:col-span-2">
                    <Label className="block">Situação por órgão</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {orgaos.map((orgao) => (
                        <div key={orgao.id} className="flex flex-col gap-1">
                          <Label className="text-xs font-normal text-muted-foreground">{orgao.nome}</Label>
                          <select
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formSituacaoPorOrgao[orgao.nome] ?? ""}
                            onChange={(e) => setFormSituacaoPorOrgao((prev) => ({ ...prev, [orgao.nome]: e.target.value }))}
                          >
                            {ORGAO_STATUS_OPCOES.map((opt) => (
                              <option key={opt || "_"} value={opt}>
                                {opt || "—"}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showBulk && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subir em massa</CardTitle>
              <CardDescription>
                Uma linha por processo. Colunas separadas por ponto-e-vírgula: tipo;status;observações;data_atualizacao(YYYY-MM-DD);data_conclusao(YYYY-MM-DD). Tipo: Limpeza de CPF ou Limpeza de CNPJ. Status: Aguardando início das baixas, Em Andamento ou 100% baixado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBulk}>
                <textarea
                  className="mb-4 min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Limpeza de CPF;Em Andamento;Aguardando documentação;2025-03-01;;&#10;Limpeza de CNPJ;100% baixado;Finalizado;2025-03-05;2025-03-05"
                />
                <Button type="submit" disabled={saving}>{saving ? "Enviando..." : "Importar"}</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Processos ({processos.length})</CardTitle>
            <CardDescription>Lista de processos deste usuário. Edite ou exclua conforme necessário.</CardDescription>
          </CardHeader>
          <CardContent>
            {processos.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Nenhum processo cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="max-w-[180px] font-semibold">Observações</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Atualização</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Conclusão</TableHead>
                      <TableHead className="w-[90px] font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processos.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="font-medium">{p.tipo_processo || "—"}</TableCell>
                        <TableCell>{p.status_processo || "—"}</TableCell>
                        <TableCell className="max-w-[180px] truncate text-muted-foreground" title={p.observacoes || undefined}>
                          {p.observacoes || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                          {formatDateDisplay(p.data_atualizacao)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                          {formatDateDisplay(p.data_conclusao)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(p)} aria-label="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)} aria-label="Excluir">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
