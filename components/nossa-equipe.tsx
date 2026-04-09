"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  EQUIPE_BELO_HORIZONTE,
  EQUIPE_CUIABA,
  type MembroEquipe,
} from "@/lib/equipe"
import { MapPin, Users } from "lucide-react"

function MembroCard({ membro }: { membro: MembroEquipe }) {
  return (
    <article className="group h-full select-none">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:ring-primary/10">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
          <Image
            src={membro.foto}
            alt={`${membro.nome}, ${membro.cargo}`}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
            aria-hidden
          />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 border-t border-gray-100/80 bg-white px-4 py-3 text-center sm:px-5 sm:py-4">
          <p className="text-sm font-semibold tracking-tight text-gray-900 sm:text-base">{membro.nome}</p>
          <p className="text-xs leading-snug text-gray-600 sm:text-sm">{membro.cargo}</p>
        </div>
      </div>
    </article>
  )
}

function EquipeCarousel({ membros, label }: { membros: MembroEquipe[]; label: string }) {
  const canLoop = membros.length > 2
  return (
    <div className="relative px-10 sm:px-12 md:px-14 lg:px-16" aria-label={label}>
      <Carousel
        opts={{
          align: "start",
          loop: canLoop,
          skipSnaps: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {membros.map((m) => (
            <CarouselItem
              key={m.id}
              className="basis-[85%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-[45%] lg:basis-1/3"
            >
              <MembroCard membro={m} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-1 top-[42%] size-11 border-gray-200 bg-white text-gray-800 shadow-lg transition-colors hover:bg-gray-50 disabled:opacity-40 sm:-left-2" />
        <CarouselNext className="-right-1 top-[42%] size-11 border-gray-200 bg-white text-gray-800 shadow-lg transition-colors hover:bg-gray-50 disabled:opacity-40 sm:-right-2" />
      </Carousel>
      <p className="mt-4 text-center text-xs text-gray-500 md:hidden">
        Deslize para ver todos os perfis
      </p>
    </div>
  )
}

export function NossaEquipe() {
  return (
    <section
      id="nossa-equipe"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/80 px-6 py-20 md:py-28"
      aria-labelledby="nossa-equipe-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-1/4 h-80 w-80 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4" aria-hidden />
            <span className="uppercase tracking-[0.2em]">Quem atende você</span>
          </div>
          <h2
            id="nossa-equipe-heading"
            className="mb-4 text-balance text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Nossa equipe
          </h2>
          <p className="text-pretty text-lg text-gray-600 md:text-xl md:leading-relaxed">
            Profissionais em <strong className="font-semibold text-gray-800">Belo Horizonte</strong> e{" "}
            <strong className="font-semibold text-gray-800">Cuiabá</strong>, unidos pelo mesmo propósito: sua
            recuperação financeira com transparência e proximidade.
          </p>
        </header>

        <Tabs defaultValue="bh" className="w-full gap-8">
          <div className="flex flex-col items-center gap-6">
            <TabsList className="grid h-auto w-full max-w-xl grid-cols-2 gap-2 rounded-2xl bg-gray-100/95 p-2 shadow-inner backdrop-blur-sm md:max-w-lg">
              <TabsTrigger
                value="bh"
                className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md md:text-base"
              >
                <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-2">
                  <MapPin className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  Belo Horizonte
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="cuiaba"
                className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md md:text-base"
              >
                <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-2">
                  <MapPin className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  Cuiabá
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bh" className="mt-0 w-full outline-none data-[state=inactive]:hidden">
              <p className="mb-6 text-center text-sm text-gray-600">
                Time de liderança, vendas e apoio — unidade em Minas Gerais.
              </p>
              <EquipeCarousel membros={EQUIPE_BELO_HORIZONTE} label="Carrossel da equipe Belo Horizonte" />
            </TabsContent>

            <TabsContent value="cuiaba" className="mt-0 w-full outline-none data-[state=inactive]:hidden">
              <p className="mb-6 text-center text-sm text-gray-600">
                Supervisão e consultoria — unidade em Mato Grosso.
              </p>
              <EquipeCarousel membros={EQUIPE_CUIABA} label="Carrossel da equipe Cuiabá" />
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-gray-200/80 pt-10 sm:flex-row">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-xl border-gray-300 bg-white px-8 font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            <Link href="/sobre">Conheça a GTSETTE</Link>
          </Button>
          <p className="max-w-sm text-center text-sm text-gray-500 sm:text-left">
            Quer visitar? Os endereços estão na seção <strong className="font-medium text-gray-700">Visite-nos</strong>,
            um pouco acima nesta página.
          </p>
        </div>
      </div>
    </section>
  )
}
