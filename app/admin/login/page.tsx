"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [seedMessage, setSeedMessage] = useState("")
  const [seedLoading, setSeedLoading] = useState(false)

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.session) router.replace("/admin/usuarios")
      })
      .catch(() => {})
  }, [router])

  const handleSeed = async () => {
    setSeedMessage("")
    setSeedLoading(true)
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setSeedMessage(data.created ? "Primeiro admin criado. Faça login com ADMIN_SEED_USERNAME e ADMIN_SEED_PASSWORD do .env." : "Já existe um admin. Faça login.")
      } else {
        setSeedMessage(data.error || "Erro ao criar admin.")
      }
    } catch {
      setSeedMessage("Erro de conexão.")
    } finally {
      setSeedLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (data.success) {
        router.replace("/admin/usuarios")
      } else {
        setError(data.error || "Falha no login.")
      }
    } catch {
      setError("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin — Login</CardTitle>
          <CardDescription>Acesso restrito à equipe. Faça login para gerenciar usuários e processos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
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
          </form>
          {seedMessage && (
            <Alert className="mt-4">
              <AlertDescription>{seedMessage}</AlertDescription>
            </Alert>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={handleSeed}
              disabled={seedLoading}
              className="underline hover:no-underline disabled:opacity-50"
            >
              {seedLoading ? "Aguarde..." : "Primeira vez? Criar primeiro admin (via .env)"}
            </button>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link href="/" className="underline hover:no-underline">Voltar ao site</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
