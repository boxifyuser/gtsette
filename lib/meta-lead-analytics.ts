/** Origem do formulário hero — alinhada ao campo `source` enviado à Boxify. */
export type MetaLeadFormSource = "home" | "financiamento-imovel" | "financiamento-veiculo"

/** Nome do conteúdo por origem (Pixel + CAPI `custom_data`). */
export const META_LEAD_CONTENT_NAME: Record<MetaLeadFormSource, string> = {
  home: "Avaliação CPF/CNPJ — formulário principal",
  "financiamento-imovel": "Lead — financiamento imobiliário",
  "financiamento-veiculo": "Lead — financiamento de veículo",
}

export function resolveMetaLeadFormSource(source: unknown): MetaLeadFormSource {
  if (source === "financiamento-imovel" || source === "financiamento-veiculo") return source
  return "home"
}
