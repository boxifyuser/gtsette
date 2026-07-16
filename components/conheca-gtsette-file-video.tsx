"use client"

import { FileVideoPlayer } from "@/components/file-video-player"

const DEFAULT_SRC = "/videos/gtsette-video-9.mov"
const DEFAULT_POSTER = "/images/gtsette-video-poster.png"

/**
 * Player institucional (home — Conheça a GTSETTE).
 * Opcional: `NEXT_PUBLIC_VIDEO_GTSETTE_URL`, `NEXT_PUBLIC_VIDEO_GTSETTE_POSTER_URL`.
 */
export function ConhecaGtsetteFileVideo() {
  const src = process.env.NEXT_PUBLIC_VIDEO_GTSETTE_URL ?? DEFAULT_SRC
  const poster = process.env.NEXT_PUBLIC_VIDEO_GTSETTE_POSTER_URL ?? DEFAULT_POSTER

  return (
    <FileVideoPlayer
      src={src}
      poster={poster}
      ariaLabel="Reproduzir vídeo institucional da GTSETTE Soluções"
      className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 md:rounded-3xl"
    />
  )
}
