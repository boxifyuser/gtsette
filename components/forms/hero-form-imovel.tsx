"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Loader2 } from "lucide-react"

const WHATSAPP_LEAD_URL = "https://api.whatsapp.com/send/?phone=5531982506478"

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
  }
  return value
}

export function HeroFormImovel() {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [valorDivida, setValorDivida] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const msg = [
      "Olá! Quero aumentar minhas chances de aprovação no financiamento imobiliário.",
      "",
      `Nome: ${nome || "—"}`,
      `Telefone: ${telefone || "—"}`,
      `E-mail: ${email || "—"}`,
      `Valor aproximado da dívida: ${valorDivida || "—"}`,
    ].join("\n")

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim() || undefined,
          phone: telefone.replace(/\D/g, "") || undefined,
          value: valorDivida.trim() || undefined,
          source: "financiamento-imovel",
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || "Não foi possível enviar. Tente novamente.")
        setLoading(false)
        return
      }

      window.open(
        `${WHATSAPP_LEAD_URL}&text=${encodeURIComponent(msg)}`,
        "_blank",
        "noopener,noreferrer"
      )
      setNome("")
      setTelefone("")
      setEmail("")
      setValorDivida("")
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-white/20 bg-white/5 p-6 shadow-xl backdrop-blur-sm sm:p-8"
    >
      <p className="mb-6 text-sm font-medium uppercase tracking-wider text-white/80">
        Receba uma proposta
      </p>
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <div>
          <Label htmlFor="hero-nome" className="text-white/90">
            Nome
          </Label>
          <Input
            id="hero-nome"
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
            className="mt-1.5 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70"
          />
        </div>
        <div>
          <Label htmlFor="hero-telefone" className="text-white/90">
            Telefone
          </Label>
          <Input
            id="hero-telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(formatPhone(e.target.value))}
            disabled={loading}
            className="mt-1.5 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70"
          />
        </div>
        <div>
          <Label htmlFor="hero-email" className="text-white/90">
            E-mail
          </Label>
          <Input
            id="hero-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1.5 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70"
          />
        </div>
        <div>
          <Label htmlFor="hero-valor" className="text-white/90">
            Valor da dívida (aproximado)
          </Label>
          <Input
            id="hero-valor"
            type="text"
            placeholder="Ex: R$ 50.000"
            value={valorDivida}
            onChange={(e) => setValorDivida(e.target.value)}
            disabled={loading}
            className="mt-1.5 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70"
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="mt-6 w-full bg-primary py-6 text-base font-semibold text-white hover:bg-primary-hover disabled:opacity-80"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        {loading ? "Enviando..." : "Enviar e falar no WhatsApp"}
      </Button>
    </form>
  )
}
