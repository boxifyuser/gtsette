"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Como Funciona", href: "/como-funciona" },
    { name: "Serviços", href: "/servicos" },
    { name: "Blog", href: "/blog" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-gtsette.png"
            alt="GTSETTE Soluções Financeiras"
            width={180}
            height={60}
            priority
            className="h-auto w-40 md:w-48"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            <Link href="/minha-conta">Minha Conta</Link>
          </Button>
          <Button asChild className="bg-primary text-white hover:bg-primary-hover">
            <Link href="/consulta">Consultar meu CPF</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto space-y-1 px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              asChild
              variant="outline"
              className="mt-2 w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <Link href="/minha-conta" onClick={() => setMobileMenuOpen(false)}>
                Minha Conta
              </Link>
            </Button>
            <Button asChild className="mt-2 w-full bg-primary text-white hover:bg-primary-hover">
              <Link href="/consulta" onClick={() => setMobileMenuOpen(false)}>
                Consultar meu CPF
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
