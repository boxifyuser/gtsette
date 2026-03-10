import { sql, ensureProcessoOrgaosTable } from "@/lib/db"

export interface OrgaoRow {
  id: string
  nome: string
  ordem: number
  ativo: boolean
  created_at: Date
}

export interface OrgaoInput {
  nome: string
  ordem?: number
  ativo?: boolean
}

const DEFAULT_ORGAOS = [
  "Serasa",
  "SPC",
  "Boa Vista",
  "Cenprot SP",
  "CENPROT Nacional",
  "Outros",
]

function rowToOrgao(r: Record<string, unknown>): OrgaoRow {
  return {
    id: String(r.id),
    nome: String(r.nome),
    ordem: Number(r.ordem) || 0,
    ativo: Boolean(r.ativo),
    created_at: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at)),
  }
}

export async function getOrgaos(activeOnly = false): Promise<OrgaoRow[]> {
  if (!sql) return []
  const ok = await ensureProcessoOrgaosTable()
  if (!ok) return []
  let rows = await (activeOnly
    ? sql`SELECT id, nome, ordem, ativo, created_at FROM processo_orgaos WHERE ativo = true ORDER BY ordem ASC, nome ASC`
    : sql`SELECT id, nome, ordem, ativo, created_at FROM processo_orgaos ORDER BY ordem ASC, nome ASC`)
  if (rows.length === 0) {
    await seedDefaultOrgaos()
    rows = await (activeOnly
      ? sql`SELECT id, nome, ordem, ativo, created_at FROM processo_orgaos WHERE ativo = true ORDER BY ordem ASC, nome ASC`
      : sql`SELECT id, nome, ordem, ativo, created_at FROM processo_orgaos ORDER BY ordem ASC, nome ASC`)
  }
  return (rows as Record<string, unknown>[]).map(rowToOrgao)
}

export async function getOrgaoById(id: string): Promise<OrgaoRow | null> {
  if (!sql) return null
  const rows = await sql`
    SELECT id, nome, ordem, ativo, created_at FROM processo_orgaos WHERE id = ${id} LIMIT 1
  `
  const r = rows[0] as Record<string, unknown> | undefined
  return r ? rowToOrgao(r) : null
}

export async function createOrgao(data: OrgaoInput): Promise<{ id: string } | { error: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const ok = await ensureProcessoOrgaosTable()
  if (!ok) return { error: "Tabela de órgãos não disponível." }
  const nome = data.nome?.trim() || ""
  if (!nome) return { error: "Nome do órgão é obrigatório." }
  const ordem = data.ordem ?? 0
  const ativo = data.ativo !== false
  try {
    const rows = await sql`
      INSERT INTO processo_orgaos (nome, ordem, ativo)
      VALUES (${nome}, ${ordem}, ${ativo})
      ON CONFLICT (nome) DO UPDATE SET ordem = EXCLUDED.ordem, ativo = EXCLUDED.ativo
      RETURNING id
    `
    const row = rows[0] as Record<string, unknown>
    return { id: String(row.id) }
  } catch (e) {
    console.error("[admin-orgaos] create:", e)
    return { error: "Erro ao criar órgão." }
  }
}

export async function updateOrgao(id: string, data: Partial<OrgaoInput>): Promise<{ error?: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const current = await getOrgaoById(id)
  if (!current) return { error: "Órgão não encontrado." }
  const nome = data.nome !== undefined ? data.nome.trim() || current.nome : current.nome
  const ordem = data.ordem !== undefined ? data.ordem : current.ordem
  const ativo = data.ativo !== undefined ? data.ativo : current.ativo
  try {
    await sql`
      UPDATE processo_orgaos SET nome = ${nome}, ordem = ${ordem}, ativo = ${ativo} WHERE id = ${id}
    `
    return {}
  } catch (e) {
    console.error("[admin-orgaos] update:", e)
    return { error: "Erro ao atualizar órgão." }
  }
}

export async function deleteOrgao(id: string): Promise<{ error?: string }> {
  if (!sql) return { error: "Banco não configurado." }
  try {
    await sql`DELETE FROM processo_orgaos WHERE id = ${id}`
    return {}
  } catch (e) {
    console.error("[admin-orgaos] delete:", e)
    return { error: "Erro ao excluir órgão." }
  }
}

/** Garante que os órgãos padrão existem (Serasa, SPC, etc.). */
export async function seedDefaultOrgaos(): Promise<void> {
  if (!sql) return
  await ensureProcessoOrgaosTable()
  for (let i = 0; i < DEFAULT_ORGAOS.length; i++) {
    await sql`
      INSERT INTO processo_orgaos (nome, ordem, ativo)
      VALUES (${DEFAULT_ORGAOS[i]}, ${i}, true)
      ON CONFLICT (nome) DO NOTHING
    `
  }
}
