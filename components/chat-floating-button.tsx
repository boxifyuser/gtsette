"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

/**
 * Resposta placeholder. Substitua esta função pela integração com sua IA
 * (ex: chamada a API, OpenAI, etc.) quando estiver configurada.
 */
async function getAiResponse(_message: string): Promise<string> {
  // TODO: integrar com a IA quando configurada
  await new Promise((r) => setTimeout(r, 600))
  return "Obrigado pela sua mensagem. Nossa assistente por IA será configurada em breve. Enquanto isso, você pode entrar em contato pelo WhatsApp ou e-mail."
}

const QUICK_OPTIONS = [
  "1 - Quero limpar meu nome",
  "2 - Quero ver o meu score",
  "3 - Já sou cliente, quero saber detalhes.",
] as const

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Temos as melhores soluções financeiras do mercado",
}

export function ChatFloatingButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Ao abrir o chat, exibir mensagem inicial da Tay; ao fechar, limpar para próxima abertura
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([WELCOME_MESSAGE])
    }
    if (!open) {
      setMessages([])
    }
  }, [open, messages.length])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const reply = await getAiResponse(trimmed)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Desculpe, ocorreu um erro. Tente novamente.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => sendMessage(input)
  const handleQuickOption = (option: string) => sendMessage(option)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Botão flutuante — canto inferior direito */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex cursor-pointer flex-col items-end gap-2 border-0 bg-transparent p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Falar agora com a GTSETTE - Abrir chat"
      >
        <span className="rounded-md bg-foreground/90 px-3 py-1.5 text-xs font-medium text-background shadow-sm">
          Falar agora com a GTSETTE
        </span>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-105 hover:bg-primary/90">
          <MessageCircle className="h-6 w-6" />
        </span>
      </button>

      {/* Janela suspensa — canto inferior direito, usuário continua vendo o site */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Chat GTSETTE"
        >
          {/* Cabeçalho */}
          <div className="flex flex-shrink-0 items-center justify-between border-b bg-[#f9fafb] px-3 py-2">
            <span className="text-base font-semibold text-gray-900">
              Tay, assistente virtual GTSette
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" && "justify-end"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Opções rápidas */}
          <div className="border-t px-3 py-2">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Escolha uma opção:
            </p>
            <div className="mb-3 flex flex-col gap-1.5">
              {QUICK_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleQuickOption(option)}
                  disabled={isLoading}
                  className="cursor-pointer rounded-lg border border-primary/30 bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de envio */}
          <div className="flex-shrink-0 border-t p-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                className="min-h-10 max-h-32 resize-none"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 flex-shrink-0"
                aria-label="Enviar mensagem"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
