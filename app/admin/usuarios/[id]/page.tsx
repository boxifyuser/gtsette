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

interface Processo {
  id: string
  user_id: string
  tipo_processo: string | null
  status_processo: string | null
  observacoes: string | null
  data_atualizacao: string | null
  data_conclusao: string | null
  created_at: string
  updated_at: string
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

  const resetForm = () => {
    setFormTipo("")
    setFormStatus("")
    setFormObs("")
    setFormDataAtual("")
    setFormDataConc("")
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
          data_atualizacao: formDataAtual || null,
          data_conclusao: formDataConc || null,
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
          data_atualizacao: formDataAtual || null,
          data_conclusao: formDataConc || null,
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
    setFormDataAtual(p.data_atualizacao || "")
    setFormDataConc(p.data_conclusao || "")
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/usuarios" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Voltar aos usuários
              </Link>
            </Button>
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
            onClick={() => { setShowNewForm(!showNewForm); setShowBulk(false); resetForm(); }}
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
                  <Input value={formTipo} onChange={(e) => setFormTipo(e.target.value)} placeholder="Ex: Limpa Nome" />
                </div>
                <div className="space-y-2">
                  <Label>Status do processo</Label>
                  <Input value={formStatus} onChange={(e) => setFormStatus(e.target.value)} placeholder="Ex: Em andamento" />
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
                Uma linha por processo. Colunas separadas por ponto-e-vírgula: tipo;status;observações;data_atualizacao(YYYY-MM-DD);data_conclusao(YYYY-MM-DD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBulk}>
                <textarea
                  className="mb-4 min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Limpa Nome;Em andamento;Aguardando documentação;2025-03-01;;&#10;Restauração Score;Concluído;Finalizado;2025-03-05;2025-03-05"
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Data atualização</TableHead>
                    <TableHead>Data conclusão</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.tipo_processo || "—"}</TableCell>
                      <TableCell>{p.status_processo || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{p.observacoes || "—"}</TableCell>
                      <TableCell>{p.data_atualizacao || "—"}</TableCell>
                      <TableCell>{p.data_conclusao || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(p)} aria-label="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} aria-label="Excluir">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
