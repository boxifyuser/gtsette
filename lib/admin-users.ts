import { sql, ensureAuthTable, ensureCadastroTable, ensureProcessosTable } from "@/lib/db"

export interface UserWithCadastro {
  id: string
  username: string
  created_at: string
  nome_completo: string | null
  cpf: string | null
  email: string | null
  cnpj: string | null
}

function mapRowToUser(r: Record<string, unknown>): UserWithCadastro {
  return {
    id: String(r.id),
    username: String(r.username),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    nome_completo: r.nome_completo != null ? String(r.nome_completo) : null,
    cpf: r.cpf != null ? String(r.cpf) : null,
    email: r.email != null ? String(r.email) : null,
    cnpj: r.cnpj != null && r.cnpj !== "" ? String(r.cnpj) : null,
  }
}

export async function listUsersWithCadastro(): Promise<UserWithCadastro[]> {
  return listUsersWithCadastroFiltered("")
}

/** Lista usuários com cadastro, opcionalmente filtrados por nome, cpf, e-mail, cnpj ou número/tipo do processo. */
export async function listUsersWithCadastroFiltered(q: string): Promise<UserWithCadastro[]> {
  if (!sql) return []
  if (!(await ensureAuthTable()) || !(await ensureCadastroTable())) return []
  const term = typeof q === "string" ? q.trim() : ""
  const pattern = term ? `%${term}%` : null

  if (!pattern) {
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
    return (rows as Record<string, unknown>[]).map(mapRowToUser)
  }

  await ensureProcessosTable()
  const ids = await sql`
    SELECT DISTINCT u.id
    FROM auth_users u
    LEFT JOIN user_cadastro c ON c.user_id = u.id
    LEFT JOIN user_processos p ON p.user_id = u.id
    WHERE
      u.username ILIKE ${pattern}
      OR c.nome_completo ILIKE ${pattern}
      OR c.cpf ILIKE ${pattern}
      OR c.email ILIKE ${pattern}
      OR c.cnpj ILIKE ${pattern}
      OR p.tipo_processo ILIKE ${pattern}
      OR p.observacoes ILIKE ${pattern}
      OR CAST(p.id AS text) ILIKE ${pattern}
  `
  const idList = (ids as Record<string, unknown>[]).map((r) => r.id).filter(Boolean)
  if (idList.length === 0) return []

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
    WHERE u.id = ANY(${idList})
    ORDER BY u.created_at DESC
  `
  return (rows as Record<string, unknown>[]).map(mapRowToUser)
}

/** Dados de um lead para importação em massa (CSV). Inclui campos de usuário e opcionalmente de processo. */
export interface LeadRow {
  nome_completo: string
  cpf: string
  email: string
  cnpj?: string | null
  tipo_processo?: string | null
  status_processo?: string | null
  observacoes?: string | null
  data_atualizacao?: string | null
  data_conclusao?: string | null
  situacao_por_orgao?: string | null
}

/** Cria usuário + cadastro para um lead (username = email; senha padrão). Opcionalmente cria um processo. Retorna id ou erro. */
export async function createLeadUser(data: LeadRow): Promise<{ id: string } | { error: string }> {
  const { createUser } = await import("@/lib/auth-neon")
  const { saveCadastro } = await import("@/lib/cadastro")
  const email = (data.email || "").trim().toLowerCase()
  if (!email) return { error: "E-mail é obrigatório." }
  const username = email
  const defaultPassword = process.env.ADMIN_BULK_DEFAULT_PASSWORD
  if (!defaultPassword) return { error: "Configure ADMIN_BULK_DEFAULT_PASSWORD no servidor para criar usuários em lote." }
  const result = await createUser(username, defaultPassword)
  if ("error" in result) return result
  const err = await saveCadastro(result.user.id, {
    nome_completo: (data.nome_completo || "").trim(),
    cpf: (data.cpf || "").replace(/\D/g, ""),
    email,
    cnpj: data.cnpj ? (data.cnpj || "").replace(/\D/g, "") || null : null,
    lgpd_consent: true,
  })
  if (err.error) {
    try {
      const { sql } = await import("@/lib/db")
      if (sql) await sql`DELETE FROM auth_users WHERE id = ${result.user.id}`
    } catch {}
    return { error: err.error }
  }
  const hasProcessData =
    (data.tipo_processo ?? "").trim() !== "" ||
    (data.status_processo ?? "").trim() !== "" ||
    (data.observacoes ?? "").trim() !== "" ||
    (data.data_atualizacao ?? "").trim() !== "" ||
    (data.data_conclusao ?? "").trim() !== "" ||
    (data.situacao_por_orgao ?? "").trim() !== ""
  if (hasProcessData) {
    const { createProcesso } = await import("@/lib/admin-processos")
    let situacaoPorOrgao: Record<string, string> | null = null
    if ((data.situacao_por_orgao ?? "").trim()) {
      try {
        const parsed = JSON.parse(data.situacao_por_orgao!.trim()) as unknown
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          situacaoPorOrgao = {}
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof k === "string" && typeof v === "string") situacaoPorOrgao[k] = v
          }
          if (Object.keys(situacaoPorOrgao).length === 0) situacaoPorOrgao = null
        }
      } catch {
        /* ignorar JSON inválido */
      }
    }
    const procResult = await createProcesso(result.user.id, {
      tipo_processo: (data.tipo_processo ?? "").trim() || null,
      status_processo: (data.status_processo ?? "").trim() || null,
      observacoes: (data.observacoes ?? "").trim() || null,
      data_atualizacao: (data.data_atualizacao ?? "").trim() || null,
      data_conclusao: (data.data_conclusao ?? "").trim() || null,
      situacao_por_orgao: situacaoPorOrgao ?? undefined,
    })
    if ("error" in procResult) {
      /* usuário já foi criado; apenas não criamos o processo */
    }
  }
  return { id: result.user.id }
}

/** Importação em massa de leads. Retorna criados e erros por linha. */
export async function bulkCreateLeads(rows: LeadRow[]): Promise<{ created: number; errors: { line: number; error: string }[] }> {
  const errors: { line: number; error: string }[] = []
  let created = 0
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row?.email?.trim()) {
      errors.push({ line: i + 1, error: "E-mail vazio." })
      continue
    }
    const result = await createLeadUser({
      nome_completo: row.nome_completo ?? "",
      cpf: row.cpf ?? "",
      email: row.email,
      cnpj: row.cnpj ?? null,
      tipo_processo: row.tipo_processo ?? null,
      status_processo: row.status_processo ?? null,
      observacoes: row.observacoes ?? null,
      data_atualizacao: row.data_atualizacao ?? null,
      data_conclusao: row.data_conclusao ?? null,
      situacao_por_orgao: row.situacao_por_orgao ?? null,
    })
    if ("error" in result) {
      errors.push({ line: i + 1, error: result.error })
    } else {
      created++
    }
  }
  return { created, errors }
}

/** Exclui usuários (auth_users) por ID. Cascade remove cadastro e processos. Retorna quantidade excluída. */
export async function bulkDeleteUsers(ids: string[]): Promise<{ deleted: number; error?: string }> {
  if (!sql) return { deleted: 0, error: "Banco não configurado." }
  const validIds = ids.filter((id) => typeof id === "string" && id.trim().length > 0)
  if (validIds.length === 0) return { deleted: 0 }
  try {
    await sql`DELETE FROM auth_users WHERE id = ANY(${validIds})`
    return { deleted: validIds.length }
  } catch (e) {
    console.error("[admin-users] bulkDeleteUsers:", e)
    return { deleted: 0, error: "Erro ao excluir usuários." }
  }
}
