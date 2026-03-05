import { sql, ensureAuthTable, ensureCadastroTable } from "@/lib/db"

export interface UserWithCadastro {
  id: string
  username: string
  created_at: string
  nome_completo: string | null
  cpf: string | null
  email: string | null
  cnpj: string | null
}

export async function listUsersWithCadastro(): Promise<UserWithCadastro[]> {
  if (!sql) return []
  if (!(await ensureAuthTable()) || !(await ensureCadastroTable())) return []
  const rows = await sql`
    SELECT
      u.id,
      u.username,
      u.created_at,
      c.nome_completo,
      c.cpf,
      c.email,
      c.cnpj
    FROM auth_users u
    LEFT JOIN user_cadastro c ON c.user_id = u.id
    ORDER BY u.created_at DESC
  `
  return (rows as Record<string, unknown>[]).map((r) => ({
    id: String(r.id),
    username: String(r.username),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    nome_completo: r.nome_completo != null ? String(r.nome_completo) : null,
    cpf: r.cpf != null ? String(r.cpf) : null,
    email: r.email != null ? String(r.email) : null,
    cnpj: r.cnpj != null && r.cnpj !== "" ? String(r.cnpj) : null,
  }))
}
