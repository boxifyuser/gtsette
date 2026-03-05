import { sql, ensureCadastroTable } from "@/lib/db"

export interface CadastroData {
  nome_completo: string
  cpf: string
  email: string
  cnpj: string | null
  lgpd_consent: boolean
}

function normalizeDoc(value: string): string {
  return value.replace(/\D/g, "")
}

function validCPF(doc: string): boolean {
  const n = normalizeDoc(doc)
  if (n.length !== 11) return false
  if (/^(\d)\1+$/.test(n)) return false
  let sum = 0
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(n[i - 1], 10) * (11 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(n[9], 10)) return false
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(n[i - 1], 10) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(n[10], 10)) return false
  return true
}

function validCNPJ(doc: string): boolean {
  const n = normalizeDoc(doc)
  if (n.length !== 14) return false
  if (/^(\d)\1+$/.test(n)) return false
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(n[i], 10) * w1[i]
  let remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder
  if (remainder !== parseInt(n[12], 10)) return false
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(n[i], 10) * w2[i]
  remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder
  if (remainder !== parseInt(n[13], 10)) return false
  return true
}

export function validateCPF(cpf: string): boolean {
  return validCPF(cpf)
}

export function validateCNPJ(cnpj: string): boolean {
  if (!cnpj || !cnpj.trim()) return true
  return validCNPJ(cnpj)
}

export function formatCPF(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 11)
  return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function formatCNPJ(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 14)
  return n
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export async function getCadastroByUserId(userId: string): Promise<CadastroData | null> {
  if (!sql) return null
  const ok = await ensureCadastroTable()
  if (!ok) return null
  const rows = await sql`
    SELECT nome_completo, cpf, email, cnpj, lgpd_consent
    FROM user_cadastro
    WHERE user_id = ${userId}
    LIMIT 1
  `
  const row = rows[0] as Record<string, unknown> | undefined
  if (!row) return null
  return {
    nome_completo: String(row.nome_completo ?? ""),
    cpf: String(row.cpf ?? ""),
    email: String(row.email ?? ""),
    cnpj: row.cnpj != null && row.cnpj !== "" ? String(row.cnpj) : null,
    lgpd_consent: Boolean(row.lgpd_consent),
  }
}

export async function saveCadastro(userId: string, data: CadastroData): Promise<{ error?: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const ok = await ensureCadastroTable()
  if (!ok) return { error: "Não foi possível acessar a tabela de cadastro." }

  const nome = data.nome_completo?.trim() ?? ""
  const cpf = normalizeDoc(data.cpf ?? "")
  const email = (data.email ?? "").trim().toLowerCase()
  const cnpjRaw = (data.cnpj ?? "").trim()
  const cnpj = cnpjRaw ? normalizeDoc(cnpjRaw) : null

  if (nome.length < 2) return { error: "Nome completo é obrigatório." }
  if (cpf.length !== 11) return { error: "CPF deve ter 11 dígitos." }
  if (!validCPF(data.cpf)) return { error: "CPF inválido." }
  if (!email) return { error: "E-mail é obrigatório." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail inválido." }
  if (cnpj !== null && cnpj.length !== 14) return { error: "CNPJ deve ter 14 dígitos quando informado." }
  if (cnpj !== null && !validCNPJ(data.cnpj!)) return { error: "CNPJ inválido." }
  if (!data.lgpd_consent) return { error: "É necessário aceitar o consentimento LGPD para concluir o cadastro." }

  try {
    await sql`
      INSERT INTO user_cadastro (user_id, nome_completo, cpf, email, cnpj, lgpd_consent, lgpd_consent_at, updated_at)
      VALUES (${userId}, ${nome}, ${cpf}, ${email}, ${cnpj}, true, now(), now())
      ON CONFLICT (user_id) DO UPDATE SET
        nome_completo = EXCLUDED.nome_completo,
        cpf = EXCLUDED.cpf,
        email = EXCLUDED.email,
        cnpj = EXCLUDED.cnpj,
        lgpd_consent = true,
        lgpd_consent_at = now(),
        updated_at = now()
    `
    return {}
  } catch (e) {
    console.error("[cadastro] saveCadastro:", e)
    return { error: "Erro ao salvar cadastro." }
  }
}
