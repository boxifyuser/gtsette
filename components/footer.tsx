import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#0B0D0E] text-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo-gtsette-branca.png"
                alt="GTSETTE Soluções Financeiras"
                width={320}
                height={100}
                quality={100}
                className="h-auto w-36"
              />
            </Link>
            <p className="mb-4 text-sm text-gray-300">
              Especialistas em Limpa Nome e restauração de Score. Já ajudamos mais de 80 mil brasileiros a retomarem sua
              vida financeira.
            </p>
            <div className="flex gap-3">
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-300 transition-colors hover:text-primary">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-300 transition-colors hover:text-primary">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 transition-colors hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 transition-colors hover:text-primary">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-300 transition-colors hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Serviços</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Limpa Nome</li>
              <li>Retirada de Dívidas dos Órgãos</li>
              <li>Restauração de Score</li>
              <li>Regularização Financeira</li>
              <li>Restauração de Crédito</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {process.env.NEXT_PUBLIC_CONTACT_PHONE && (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p>{process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
                  </div>
                </li>
              )}
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                </li>
              )}
              {process.env.NEXT_PUBLIC_CONTACT_ADDRESS && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p style={{ whiteSpace: "pre-line" }}>{process.env.NEXT_PUBLIC_CONTACT_ADDRESS.replace(/\\n/g, "\n")}</p>
                </li>
              )}
            </ul>
            {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
              <Button asChild className="mt-4 w-full bg-primary text-white hover:bg-primary-hover" size="sm">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} GTSETTE Soluções Financeiras. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link href="/privacidade" className="hover:text-primary">
              Política de Privacidade
            </Link>
            {" • "}
            <Link href="/termos" className="hover:text-primary">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
