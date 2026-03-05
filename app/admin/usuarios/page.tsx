"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, User, ArrowRight } from "lucide-react"

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
    if (!adminUsername) return
    setLoading(true)
    fetch("/api/admin/users")
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
  }, [adminUsername, router])

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

        {loading ? (
          <p className="text-muted-foreground">Carregando usuários...</p>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum usuário cadastrado ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <Card key={u.id} className="overflow-hidden">
                <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{u.username}</p>
                      {u.nome_completo && <p className="text-sm text-muted-foreground">{u.nome_completo}</p>}
                      {u.email && <p className="text-xs text-muted-foreground">{u.email}</p>}
                      {u.cpf && <p className="text-xs text-muted-foreground">CPF: ***.{u.cpf.slice(-3)}</p>}
                    </div>
                  </div>
                  <Button asChild size="sm" className="shrink-0">
                    <Link href={`/admin/usuarios/${u.id}`}>
                      Gerenciar processos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
