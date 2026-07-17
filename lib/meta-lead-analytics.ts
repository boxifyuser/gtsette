/** Origem do formulário hero — alinhada ao campo `source` enviado à Boxify. */
export type MetaLeadFormSource =
  | "home"
  | "financiamento-imovel"
  | "financiamento-veiculo"
  | "rating-bancario"

/** Nome do conteúdo por origem (Pixel + CAPI `custom_data`). */
export const META_LEAD_CONTENT_NAME: Record<MetaLeadFormSource, string> = {
  home: "Avaliação CPF/CNPJ — formulário principal",
  "financiamento-imovel": "Lead — financiamento imobiliário",
  "financiamento-veiculo": "Lead — financiamento de veículo",
  "rating-bancario": "LeadRating — rating bancário",
}

/**
 * Evento Meta por origem.
 * `rating-bancario` usa conversão personalizada LeadRating (não o Lead padrão).
 */
export function metaConversionEventName(
  source: MetaLeadFormSource
): "Lead" | "LeadRating" {
  return source === "rating-bancario" ? "LeadRating" : "Lead"
}

export function resolveMetaLeadFormSource(source: unknown): MetaLeadFormSource {
  if (
    source === "financiamento-imovel" ||
    source === "financiamento-veiculo" ||
    source === "rating-bancario"
  ) {
    return source
  }
  return "home"
}
