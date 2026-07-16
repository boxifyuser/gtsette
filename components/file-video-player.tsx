"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import ReactPlayer from "react-player"

type FileVideoPlayerProps = {
  src: string
  poster?: string
  ariaLabel?: string
  className?: string
  /** Preenche a largura/altura do container (útil em seções full-bleed). */
  objectFit?: "contain" | "cover"
}

/**
 * Player com capa (1 clique = play). Evita o modo `light` do react-player (props inválidas no `<video>`).
 */
export function FileVideoPlayer({
  src,
  poster,
  ariaLabel = "Reproduzir vídeo",
  className,
  objectFit = "contain",
}: FileVideoPlayerProps) {
  const [failed, setFailed] = useState(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoObjectClass =
    objectFit === "cover"
      ? "[&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      : "[&_video]:h-full [&_video]:w-full [&_video]:object-contain"

  if (failed) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/40 p-6 text-center text-sm text-white/80">
        <p>Não foi possível reproduzir o vídeo neste navegador.</p>
      </div>
    )
  }

  return (
    <div
      className={
        className ??
        "overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
      }
    >
      <div className="relative aspect-video w-full">
        {!started ? (
          <button
            type="button"
            onClick={() => {
              setStarted(true)
              setPlaying(true)
            }}
            className="group relative block h-full w-full bg-cover bg-center bg-black"
            style={poster ? { backgroundImage: `url("${poster}")` } : undefined}
            aria-label={ariaLabel}
          >
            {!poster ? (
              <span className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" aria-hidden />
            ) : null}
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" aria-hidden />
            <span className="relative flex h-full min-h-[160px] w-full items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl ring-4 ring-white/30 transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                <Play className="ml-0.5 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" strokeWidth={1.5} aria-hidden />
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
            className={`absolute inset-0 ${videoObjectClass}`}
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
