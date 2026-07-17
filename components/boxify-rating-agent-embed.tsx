"use client"

import { useEffect } from "react"

const AGENT_ID = "359f9bcb-8c25-4dbd-ac9a-170f909c0c60"
const SCRIPT_ID = "boxify-rating-agent"

const EMBED_CONFIG = {
  // "bubble" abre o chat como painel ancorado ao lado/acima do botão (não em janela nova nem tela cheia)
  display: { mode: "bubble" },
  button: {
    position: "bottom-right",
    backgroundColor: "#dc2626",
    iconColor: "#ffffff",
    size: "medium",
  },
  chat: {
    primaryColor: "#16a34a",
    width: 420,
    height: 600,
    headerTitle: "",
    headerBackground: "#f9fafb",
    borderRadius: 8,
    chatBackground: "#f0f2f5",
    userMessageTextColor: "#ffffff",
    assistantMessageBackground: "#ffffff",
    assistantMessageTextColor: "#1f2937",
    inputBackground: "#ffffff",
    productPanelBackground: "#ffffff",
  },
} as const

/**
 * Embed oficial Boxify (agent.js) — exclusivo da página Rating Bancário.
 * Injeta o script no mount e remove widget/script ao sair da página.
 */
export function BoxifyRatingAgentEmbed() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = "https://boxify.com.br/embed/agent.js"
    script.defer = true
    script.dataset.agentId = AGENT_ID
    script.dataset.embedConfig = JSON.stringify(EMBED_CONFIG)
    document.body.appendChild(script)

    return () => {
      document.getElementById(SCRIPT_ID)?.remove()
      // Remove UI residual do embed (botão/painel) se o script tiver criado nós no body
      document
        .querySelectorAll(
          '[id*="boxify"], [class*="boxify"], iframe[src*="boxify.com.br/embed"]'
        )
        .forEach((el) => el.remove())
    }
  }, [])

  return null
}
