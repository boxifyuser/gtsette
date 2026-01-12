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
                src="/images/logo-gtsette-white.png"
                alt="GTSETTE Soluções Financeiras"
                width={160}
                height={50}
                className="h-auto w-36"
              />
            </Link>
            <p className="mb-4 text-sm text-gray-300">
              Especialistas em Limpa Nome e restauração de Score. Já ajudamos mais de 40 mil brasileiros a retomarem sua
              vida financeira.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
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
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Serviços</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Limpa Nome</li>
              <li>Negociação de Dívidas</li>
              <li>Aumento de Score</li>
              <li>Regularização Financeira</li>
              <li>Restauração de Crédito</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>(31) 98765-4321</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>contato@gtsette.com.br</p>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Av. Augusto de Lima, 407 – Loja 11
                  <br />
                  Lourdes – Belo Horizonte/MG
                </p>
              </li>
            </ul>
            <Button asChild className="mt-4 w-full bg-primary text-white hover:bg-primary-hover" size="sm">
              <a
                href="https://wa.me/5531987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
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
