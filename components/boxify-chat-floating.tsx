"use client"

import { useState } from "react"

/**
 * Origem do embed e agentId precisam ser públicos (NEXT_PUBLIC_*) para o cliente.
 * Se não definidos, usamos os valores padrão do Boxify da GTSETTE para o botão não sumir.
 */
const BOXIFY_ORIGIN =
  process.env.NEXT_PUBLIC_BOXIFY_EMBED_ORIGIN?.replace(/\/$/, "") || "https://boxify.com.br"
const AGENT_ID =
  process.env.NEXT_PUBLIC_BOXIFY_AGENT_ID || "6f4f714e-0e24-4fe5-93ba-91da206276c6"

const CHAT_CONFIG = {
  primaryColor: "16a34a",
  width: 420,
  height: 600,
  headerTitle: "",
  headerBackground: "f9fafb",
  borderRadius: 8,
} as const

const BUTTON_CONFIG = {
  position: "bottom-right" as const,
  backgroundColor: "#dc2626",
  iconColor: "#ffffff",
  size: 56, // medium
}

function buildChatIframeUrl(): string {
  const params = new URLSearchParams()
  params.set("agentId", AGENT_ID)
  params.set("primaryColor", CHAT_CONFIG.primaryColor)
  params.set("width", String(CHAT_CONFIG.width))
  params.set("height", String(CHAT_CONFIG.height))
  if (CHAT_CONFIG.headerTitle) params.set("headerTitle", CHAT_CONFIG.headerTitle)
  params.set("headerBg", CHAT_CONFIG.headerBackground)
  params.set("borderRadius", String(CHAT_CONFIG.borderRadius))
  return `${BOXIFY_ORIGIN}/embed/chat?${params.toString()}`
}

export function BoxifyChatFloating() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botão flutuante — mesmo estilo do config Boxify, abre o chat dentro do site */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[999998] flex h-14 items-center gap-2 rounded-full border-0 pl-3 pr-4 text-2xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        style={{
          backgroundColor: BUTTON_CONFIG.backgroundColor,
          color: BUTTON_CONFIG.iconColor,
        }}
        aria-label="Falar com Atendente"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl">
          💬
        </span>
        <span className="text-sm font-medium whitespace-nowrap">Falar com Atendente</span>
      </button>

      {/* Painel flutuante com chat dentro do site (sem nova aba/janela) */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-[999999] flex h-[600px] w-[420px] max-h-[calc(100vh-2.5rem)] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Chat"
        >
          <div className="flex flex-shrink-0 items-center justify-end border-b bg-[#f9fafb] px-2 py-1.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Fechar chat"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <iframe
              src={buildChatIframeUrl()}
              title="Chat GTSETTE"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  )
}
