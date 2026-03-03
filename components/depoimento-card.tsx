"use client"

import Image from "next/image"
import { useState } from "react"

interface DepoimentoCardProps {
  src: string
  index: number
}

export function DepoimentoCard({ src, index }: DepoimentoCardProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl border border-border bg-muted/50">
        <p className="px-4 text-center text-sm text-muted-foreground">
          Depoimento {index + 1}
        </p>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={`Depoimento de cliente ${index + 1}`}
      width={400}
      height={600}
      className="aspect-[9/16] w-full object-cover object-top rounded-2xl"
      onError={() => setError(true)}
    />
  )
}
