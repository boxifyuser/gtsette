"use client"

import { useId } from "react"

/** ID do Short: https://youtube.com/shorts/42WgwbcPoOQ */
const YOUTUBE_VIDEO_ID = "42WgwbcPoOQ"

const YOUTUBE_EMBED_URL =
  `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?` +
  new URLSearchParams({
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    hl: "pt-BR",
    color: "white",
  }).toString()

/**
 * Vídeo institucional da seção "Conheça a GTSETTE Soluções" (YouTube Short embutido).
 * Foco visível no wrapper; descrição para leitores de tela.
 */
export function ConhecaGtsetteVideo() {
  const descriptionId = useId()

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-black shadow-2xl ring-1 ring-black/[0.06] transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background md:rounded-3xl md:focus-within:ring-offset-4">
        <p id={descriptionId} className="sr-only">
          Vídeo institucional da GTSETTE Soluções, incorporado do YouTube: apresentação da empresa e dos serviços de
          recuperação de crédito e limpeza de nome. Use os controles do player para reproduzir, pausar, volume e tela
          cheia. O vídeo possui áudio.
        </p>
        <div className="relative mx-auto aspect-[9/16] w-full max-w-sm sm:max-w-md">
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={YOUTUBE_EMBED_URL}
            title="Conheça a GTSETTE Soluções — vídeo institucional com áudio"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            aria-describedby={descriptionId}
          />
        </div>
      </div>
    </figure>
  )
}
