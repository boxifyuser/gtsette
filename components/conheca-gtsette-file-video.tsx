"use client"

import { useMemo, useState } from "react"
import { Play } from "lucide-react"
import ReactPlayer from "react-player"

const DEFAULT_SRC = "/videos/gtsette-video-9.mov"
/** Capa estática antes do play — substitua o arquivo em `public/images/` para outra arte. */
const DEFAULT_POSTER = "/images/gtsette-video-poster.png"

/**
 * Player em JavaScript (react-player) para o vídeo institucional.
 * Capa customizada (sem `light` do react-player) evita props inválidas no `<video>` e um único clique inicia o play.
 * Opcional: `NEXT_PUBLIC_VIDEO_GTSETTE_URL` (MP4), `NEXT_PUBLIC_VIDEO_GTSETTE_POSTER_URL` (capa).
 */
export function ConhecaGtsetteFileVideo() {
  const { src, poster } = useMemo(
    () => ({
      src: process.env.NEXT_PUBLIC_VIDEO_GTSETTE_URL ?? DEFAULT_SRC,
      poster: process.env.NEXT_PUBLIC_VIDEO_GTSETTE_POSTER_URL ?? DEFAULT_POSTER,
    }),
    []
  )
  const [failed, setFailed] = useState(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)

  if (failed) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600 md:rounded-3xl">
        <p>Não foi possível reproduzir o vídeo neste navegador ou dispositivo.</p>
        <p className="text-xs text-gray-500">
          Arquivos .mov costumam funcionar melhor no Safari. Para o Chrome e outros, use um MP4 (H.264) e defina{" "}
          <code className="rounded bg-gray-200 px-1">NEXT_PUBLIC_VIDEO_GTSETTE_URL</code> ou substitua o arquivo em{" "}
          <code className="rounded bg-gray-200 px-1">public/videos/</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 md:rounded-3xl">
      <div className="relative aspect-video w-full max-h-[min(75vh,720px)]">
        {!started ? (
          <button
            type="button"
            onClick={() => {
              setStarted(true)
              setPlaying(true)
            }}
            className="group relative block aspect-video w-full max-h-[min(75vh,720px)] bg-cover bg-center bg-black"
            style={{ backgroundImage: `url("${poster}")` }}
            aria-label="Reproduzir vídeo institucional da GTSETTE Soluções"
          >
            <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" aria-hidden />
            <span className="relative flex h-full min-h-[200px] w-full items-center justify-center">
              <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-primary text-white shadow-2xl ring-4 ring-white/30 transition-transform group-hover:scale-105">
                <Play className="ml-1 h-10 w-10" fill="currentColor" strokeWidth={1.5} aria-hidden />
              </span>
            </span>
          </button>
        ) : (
          <ReactPlayer
            src={src}
            controls
            playsInline
            preload="metadata"
            width="100%"
            height="100%"
            className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-contain"
            poster={poster}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  )
}
