"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.session) router.replace("/admin/usuarios")
        else router.replace("/admin/login")
      })
      .catch(() => router.replace("/admin/login"))
  }, [router])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  )
}
