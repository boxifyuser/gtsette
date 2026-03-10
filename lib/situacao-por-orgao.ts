/**
 * Valores que não devem ser gravados/exibidos em Situação por órgão
 * (ex.: caminho colado por engano no CSV ou no select).
 */
const INVALID_SITUACAO_VALUES = [
  "admin/usuários",
  "admin/usuarios",
  "/admin/usuários",
  "/admin/usuarios",
]

function isInvalidSituacaoValue(v: string): boolean {
  const s = v.trim().toLowerCase()
  if (!s) return false
  return INVALID_SITUACAO_VALUES.some((bad) => s === bad.toLowerCase())
}

/**
 * Remove entradas inválidas (ex. "admin/usuários" no órgão Outros).
 * Retorna novo objeto sem mutar o original.
 */
export function sanitizeSituacaoPorOrgao(
  obj: Record<string, string> | null | undefined
): Record<string, string> {
  if (!obj || typeof obj !== "object") return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue
    const str = String(v).trim()
    if (str === "" || isInvalidSituacaoValue(str)) continue
    out[k] = str
  }
  return out
}
