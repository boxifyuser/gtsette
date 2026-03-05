"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, ArrowLeft, Plus, Trash2, Check, X } from "lucide-react"

interface Orgao {
  id: string
  nome: string
  ordem: number
  ativo: boolean
  created_at: string
}

export default function AdminOrgaosPage() {
  const router = useRouter()
  const [orgaos, setOrgaos] = useState<Orgao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [adminUsername, setAdminUsername] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formNome, setFormNome] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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

  const loadOrgaos = useCallback(() => {
    return fetch("/api/admin/orgaos")
      .then((r) => r.json())
      .then((data) => setOrgaos(Array.isArray(data?.orgaos) ? data.orgaos : []))
      .catch(() => setError("Erro ao carregar órgãos."))
  }, [])

  useEffect(() => {
    loadSession().then((session) => {
      if (session) loadOrgaos().finally(() => setLoading(false))
    })
  }, [loadSession, loadOrgaos])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  const handleSeed = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/orgaos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: true }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Órgãos padrão criados/atualizados.")
        setOrgaos(data.orgaos || [])
      } else setMessage(data.error || "Erro ao criar órgãos.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNome.trim()) {
      setMessage("Informe o nome do órgão.")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/orgaos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: formNome.trim(), ativo: true }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Órgão criado.")
        setFormNome("")
        setShowForm(false)
        loadOrgaos()
      } else setMessage(data.error || "Erro ao criar.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (orgao: Orgao) => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/orgaos/${orgao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !orgao.ativo }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage(orgao.ativo ? "Órgão desativado." : "Órgão ativado.")
        loadOrgaos()
      } else setMessage(data.error || "Erro ao atualizar.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este órgão? Processos que usam este órgão manterão o nome no histórico, mas o órgão não aparecerá mais na lista.")) return
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/orgaos/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setMessage("Órgão excluído.")
        loadOrgaos()
      } else setMessage(data.error || "Erro ao excluir.")
    } catch {
      setMessage("Erro de conexão.")
    } finally {
      setSaving(false)
    }
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
        <div className="container mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/usuarios" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Voltar aos usuários
              </Link>
            </Button>
            <h1 className="mt-2 text-xl font-bold">Órgãos (Situação por órgão)</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os órgãos exibidos em &quot;Situação por órgão&quot; nos detalhes do processo. Ative/desative ou adicione novos.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
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
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={saving}>
            Criar órgãos padrão (Serasa, SPC, etc.)
          </Button>
          <Button
            size="sm"
            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormNome(""); setMessage(""); }}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo órgão
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo órgão</CardTitle>
              <CardDescription>O nome aparecerá nos cards de situação por órgão (ex.: Serasa, SPC).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Serasa"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Criar"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setFormNome(""); }}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de órgãos ({orgaos.length})</CardTitle>
            <CardDescription>Órgãos ativos aparecem para o usuário em &quot;Seus processos&quot; → detalhes. Desative para ocultar sem excluir.</CardDescription>
          </CardHeader>
          <CardContent>
            {orgaos.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Nenhum órgão. Use &quot;Criar órgãos padrão&quot; ou adicione um novo.</p>
            ) : (
              <ul className="space-y-2">
                {orgaos.map((o) => (
                  <li
                    key={o.id}
                    className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 ${!o.ativo ? "bg-muted/30 opacity-75" : ""}`}
                  >
                    <span className="font-medium">{o.nome}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={o.ativo ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleToggleAtivo(o)}
                        disabled={saving}
                        title={o.ativo ? "Desativar" : "Ativar"}
                      >
                        {o.ativo ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        {o.ativo ? " Desativar" : " Ativar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(o.id)}
                        disabled={saving}
                        aria-label="Excluir"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
