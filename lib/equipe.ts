export type MembroEquipe = {
  id: string
  nome: string
  cargo: string
  /** Caminho em /public (ex.: /images/equipe/nome.png) */
  foto: string
}

/** Unidade Belo Horizonte — ordem: liderança e áreas de apoio. */
export const EQUIPE_BELO_HORIZONTE: MembroEquipe[] = [
  {
    id: "tayna-novais",
    nome: "Taynã Novais",
    cargo: "CEO",
    foto: "/images/equipe/tayna-novais.png",
  },
  {
    id: "manuella-martins",
    nome: "Manuella Martins",
    cargo: "Gerente comercial",
    foto: "/images/equipe/manuella-martins.png",
  },
  {
    id: "fatima-viana",
    nome: "Fátima Viana",
    cargo: "Gerente financeiro | DP",
    foto: "/images/equipe/fatima-viana.png",
  },
  {
    id: "adiane-caroline",
    nome: "Adiane Caroline",
    cargo: "Supervisora de vendas",
    foto: "/images/equipe/adiane-caroline.png",
  },
  {
    id: "vitoria-gondim",
    nome: "Vitória Gondim",
    cargo: "Assistente financeiro",
    foto: "/images/equipe/vitoria-gondim.png",
  },
  {
    id: "flavia-ferraz",
    nome: "Flávia Ferraz",
    cargo: "Consultora de vendas",
    foto: "/images/equipe/flavia-ferraz.png",
  },
]

/** Unidade Cuiabá — consultoras e supervisão local. */
export const EQUIPE_CUIABA: MembroEquipe[] = [
  {
    id: "lorena-queiroz",
    nome: "Lorena Queiroz",
    cargo: "Supervisora de vendas",
    foto: "/images/equipe/lorena-queiroz.png",
  },
  {
    id: "edmilce-magalhaes",
    nome: "Edmilce Magalhães",
    cargo: "Consultora de vendas",
    foto: "/images/equipe/edmilce-magalhaes.png",
  },
  {
    id: "alanis-menezes",
    nome: "Alanis Menezes",
    cargo: "Consultora de vendas",
    foto: "/images/equipe/alanis-menezes.png",
  },
]
