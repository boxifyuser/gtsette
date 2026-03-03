"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Loader2 } from "lucide-react"

const WHATSAPP_LEAD_URL = "https://api.whatsapp.com/send/?phone=5531982506478"

/** Slug da página onde o formulário está — define a mensagem do WhatsApp e o source da API */
export type HeroFormPageSlug = "home" | "financiamento-imovel" | "financiamento-veiculo"

const WHATSAPP_INTRO_BY_PAGE: Record<HeroFormPageSlug, string> = {
  home: "Olá! Gostaria de receber uma proposta para limpar meu nome e organizar minha vida financeira.",
  "financiamento-imovel":
    "Olá! Quero aumentar minhas chances de aprovação no financiamento imobiliário.",
  "financiamento-veiculo":
    "Olá! Quero aumentar minhas chances de aprovação no financiamento de veículo.",
}

/** Máscara: (00) 00000-0000 — celular 11 dígitos ou (00) 0000-0000 — fixo 10 dígitos */
function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : ""
  }
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

/** Telefone válido: 10 (fixo) ou 11 (celular) dígitos */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 10 || digits.length === 11
}

/** E-mail válido (formato básico) */
function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim())
}

/** Máscara: R$ 50.000 (valor inteiro em reais, separador de milhares) */
function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return ""
  const intPart = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `R$ ${intPart}`
}

/** Remove máscara e retorna número inteiro para a API */
function parseCurrencyToNumber(value: string): number | undefined {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return undefined
  const num = parseInt(digits, 10)
  return Number.isNaN(num) ? undefined : num
}

export interface HeroFormImovelProps {
  /** Slug da página para personalizar mensagem WhatsApp e source (padrão: home) */
  pageSlug?: HeroFormPageSlug
}

export function HeroFormImovel({ pageSlug = "home" }: HeroFormImovelProps) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [valorDivida, setValorDivida] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ telefone?: string; email?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const errors: { telefone?: string; email?: string } = {}
    const phoneDigits = telefone.replace(/\D/g, "")
    if (phoneDigits.length > 0 && !isValidPhone(telefone)) {
      errors.telefone = "Informe um telefone válido (10 ou 11 dígitos)."
    }
    if (email.trim().length > 0 && !isValidEmail(email)) {
      errors.email = "Informe um e-mail válido."
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    const intro = WHATSAPP_INTRO_BY_PAGE[pageSlug]
    const msg = [
      intro,
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
          value: parseCurrencyToNumber(valorDivida) != null ? String(parseCurrencyToNumber(valorDivida)) : undefined,
          source: pageSlug,
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
      className="w-full rounded-xl border border-white/20 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:rounded-2xl sm:p-6 lg:p-8"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/80 sm:mb-6 sm:text-sm">
        Receba uma Avaliação do seu CPF ou CNPJ.
      </p>
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="hero-nome" className="text-sm text-white/90 sm:text-base">
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
            className="mt-1 h-10 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70 sm:h-11 sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor="hero-telefone" className="text-sm text-white/90 sm:text-base">
            Telefone
          </Label>
          <Input
            id="hero-telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => {
              setTelefone(formatPhone(e.target.value))
              if (fieldErrors.telefone) setFieldErrors((prev) => ({ ...prev, telefone: undefined }))
            }}
            disabled={loading}
            className={`mt-1 h-10 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70 sm:h-11 sm:text-base ${fieldErrors.telefone ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            aria-invalid={!!fieldErrors.telefone}
            aria-describedby={fieldErrors.telefone ? "hero-telefone-error" : undefined}
          />
          {fieldErrors.telefone && (
            <p id="hero-telefone-error" className="mt-1 text-xs text-red-300">
              {fieldErrors.telefone}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="hero-email" className="text-sm text-white/90 sm:text-base">
            E-mail
          </Label>
          <Input
            id="hero-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
            }}
            disabled={loading}
            className={`mt-1 h-10 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70 sm:h-11 sm:text-base ${fieldErrors.email ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "hero-email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="hero-email-error" className="mt-1 text-xs text-red-300">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="hero-valor" className="text-sm text-white/90 sm:text-base">
            Valor da dívida (aproximado)
          </Label>
          <Input
            id="hero-valor"
            type="text"
            placeholder="Ex: R$ 50.000"
            value={valorDivida}
            onChange={(e) => setValorDivida(formatCurrency(e.target.value))}
            disabled={loading}
            className="mt-1 h-10 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50 focus-visible:border-primary focus-visible:ring-primary/50 disabled:opacity-70 sm:h-11 sm:text-base"
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="mt-4 w-full bg-primary py-5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-80 sm:mt-6 sm:py-6 sm:text-base"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        {loading ? "Enviando..." : "Receber Avaliação"}
      </Button>
    </form>
  )
}
