"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Loader2, AlertCircle } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51RQuPZGDCq9GHABeRAjfSTg28xtDWDI1m4ikv64Gg6xWiwouFdct2OH3JaPqmKuVwAakTOtS7T2vmuoVA8oYZByx007obE3niK"
)

export default function ConsultaPage() {
  const [cpf, setCpf] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2")
    }
    return value
  }

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "")
    if (numbers.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) return false

    // Validação dos dígitos verificadores
    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(numbers.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(numbers.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(numbers.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(numbers.substring(10, 11))) return false

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!validateCPF(cpf)) {
      setError("CPF inválido. Por favor, verifique os dados.")
      setLoading(false)
      return
    }

    if (birthDate.replace(/\D/g, "").length !== 8) {
      setError("Data de nascimento inválida. Use o formato DD/MM/AAAA.")
      setLoading(false)
      return
    }

    try {
      // Criar sessão de checkout
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: cpf.replace(/\D/g, ""),
          birthDate: birthDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento")
      }

      // Redirecionar para o Stripe Checkout
      const stripe = await stripePromise
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="bg-primary px-4 py-16 text-white md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Consulta de CPF</h1>
          <p className="text-balance text-lg text-white/90">
            Consulte seu CPF e obtenha informações completas sobre sua situação creditícia
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Digite seus dados</CardTitle>
              <CardDescription>
                Informe seu CPF e data de nascimento para realizar a consulta. O valor da consulta é de{" "}
                <strong className="text-primary">R$ 50,00</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    placeholder="DD/MM/AAAA"
                    value={birthDate}
                    onChange={(e) => setBirthDate(formatDate(e.target.value))}
                    maxLength={10}
                    required
                  />
                </div>

                {/* Price Display */}
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor da consulta</p>
                      <p className="text-2xl font-bold text-primary">R$ 50,00</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar e Consultar CPF
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-2 rounded-lg bg-muted p-4">
                <p className="text-sm font-semibold">O que você receberá:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Informações completas sobre sua situação creditícia</li>
                  <li>• Score de crédito atualizado</li>
                  <li>• Lista de restrições e pendências</li>
                  <li>• Dados de todos os órgãos de proteção ao crédito</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold">Como funciona a consulta?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Nossa consulta utiliza a API oficial da Serasa Experian para fornecer informações precisas e atualizadas
              sobre sua situação creditícia.
            </p>
            <p>
              Após o pagamento, você terá acesso imediato a todas as informações, incluindo score, restrições e
              pendências em todos os órgãos de proteção ao crédito.
            </p>
            <p>
              Os dados são consultados em tempo real diretamente da Serasa Experian, garantindo a máxima precisão e
              atualidade das informações.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
