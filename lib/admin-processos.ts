import { sql, ensureProcessosTable } from "@/lib/db"
import { sanitizeSituacaoPorOrgao } from "@/lib/situacao-por-orgao"

export interface ProcessoRow {
  id: string
  user_id: string
  tipo_processo: string | null
  status_processo: string | null
  observacoes: string | null
  data_atualizacao: string | null
  data_conclusao: string | null
  situacao_por_orgao: Record<string, string> | null
  created_at: Date
  updated_at: Date
}

export interface ProcessoInput {
  tipo_processo?: string | null
  status_processo?: string | null
  observacoes?: string | null
  data_atualizacao?: string | null
  data_conclusao?: string | null
  situacao_por_orgao?: Record<string, string> | null
}

function parseSituacaoPorOrgao(v: unknown): Record<string, string> | null {
  if (v == null) return null
  if (typeof v !== "object" || Array.isArray(v)) return null
  const raw: Record<string, string> = {}
  for (const [k, val] of Object.entries(v)) {
    if (typeof k === "string" && typeof val === "string") raw[k] = val
  }
  const out = sanitizeSituacaoPorOrgao(raw)
  return Object.keys(out).length ? out : null
}

function rowToProcesso(r: Record<string, unknown>): ProcessoRow {
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    tipo_processo: r.tipo_processo != null ? String(r.tipo_processo) : null,
    status_processo: r.status_processo != null ? String(r.status_processo) : null,
    observacoes: r.observacoes != null ? String(r.observacoes) : null,
    data_atualizacao: r.data_atualizacao != null ? String(r.data_atualizacao) : null,
    data_conclusao: r.data_conclusao != null ? String(r.data_conclusao) : null,
    situacao_por_orgao: parseSituacaoPorOrgao(r.situacao_por_orgao),
    created_at: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at)),
    updated_at: r.updated_at instanceof Date ? r.updated_at : new Date(String(r.updated_at)),
  }
}

export async function getProcessosByUserId(userId: string): Promise<ProcessoRow[]> {
  if (!sql) return []
  const ok = await ensureProcessosTable()
  if (!ok) return []
  const rows = await sql`
    SELECT id, user_id, tipo_processo, status_processo, observacoes, data_atualizacao, data_conclusao, situacao_por_orgao, created_at, updated_at
    FROM user_processos
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `
  return (rows as Record<string, unknown>[]).map(rowToProcesso)
}

export async function getProcessoById(id: string): Promise<ProcessoRow | null> {
  if (!sql) return null
  const rows = await sql`
    SELECT id, user_id, tipo_processo, status_processo, observacoes, data_atualizacao, data_conclusao, situacao_por_orgao, created_at, updated_at
    FROM user_processos
    WHERE id = ${id}
    LIMIT 1
  `
  const r = rows[0] as Record<string, unknown> | undefined
  return r ? rowToProcesso(r) : null
}

export async function createProcesso(userId: string, data: ProcessoInput): Promise<{ id: string } | { error: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const ok = await ensureProcessosTable()
  if (!ok) return { error: "Tabela de processos não disponível." }
  const tipo = data.tipo_processo?.trim() || null
  const status = data.status_processo?.trim() || null
  const obs = data.observacoes?.trim() || null
  const dataAtual = data.data_atualizacao?.trim() || null
  const dataConc = data.data_conclusao?.trim() || null
  const situacaoObj = sanitizeSituacaoPorOrgao(data.situacao_por_orgao ?? {})
  const situacao = Object.keys(situacaoObj).length > 0 ? JSON.stringify(situacaoObj) : "{}"
  try {
    const rows = await sql`
      INSERT INTO user_processos (user_id, tipo_processo, status_processo, observacoes, data_atualizacao, data_conclusao, situacao_por_orgao, updated_at)
      VALUES (${userId}, ${tipo}, ${status}, ${obs}, ${dataAtual || null}, ${dataConc || null}, ${situacao}::jsonb, now())
      RETURNING id
    `
    const row = rows[0] as Record<string, unknown>
    return { id: String(row.id) }
  } catch (e) {
    console.error("[admin-processos] create:", e)
    return { error: "Erro ao criar processo." }
  }
}

export async function updateProcesso(id: string, data: ProcessoInput): Promise<{ error?: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const current = await getProcessoById(id)
  if (!current) return { error: "Processo não encontrado." }
  const tipo = data.tipo_processo !== undefined ? (data.tipo_processo?.trim() || null) : current.tipo_processo
  const status = data.status_processo !== undefined ? (data.status_processo?.trim() || null) : current.status_processo
  const obs = data.observacoes !== undefined ? (data.observacoes?.trim() || null) : current.observacoes
  const dataAtual = data.data_atualizacao !== undefined ? (data.data_atualizacao?.trim() || null) : current.data_atualizacao
  const dataConc = data.data_conclusao !== undefined ? (data.data_conclusao?.trim() || null) : current.data_conclusao
  const situacao =
    data.situacao_por_orgao !== undefined
      ? (() => {
          const cleaned = sanitizeSituacaoPorOrgao(data.situacao_por_orgao ?? {})
          return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : "{}"
        })()
      : (() => {
          // Regravar JSON limpo para retirar valores inválidos (ex.: admin/usuários) sem exigir reedição
          const cleaned = sanitizeSituacaoPorOrgao(current.situacao_por_orgao ?? {})
          return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : "{}"
        })()
  try {
    await sql`
      UPDATE user_processos SET
        tipo_processo = ${tipo},
        status_processo = ${status},
        observacoes = ${obs},
        data_atualizacao = ${dataAtual},
        data_conclusao = ${dataConc},
        situacao_por_orgao = ${situacao}::jsonb,
        updated_at = now()
      WHERE id = ${id}
    `
    return {}
  } catch (e) {
    console.error("[admin-processos] update:", e)
    return { error: "Erro ao atualizar processo." }
  }
}

export async function deleteProcesso(id: string): Promise<{ error?: string }> {
  if (!sql) return { error: "Banco não configurado." }
  try {
    await sql`DELETE FROM user_processos WHERE id = ${id}`
    return {}
  } catch (e) {
    console.error("[admin-processos] delete:", e)
    return { error: "Erro ao excluir processo." }
  }
}

/** Insere ou atualiza em massa. items[].id opcional; se não tiver id, cria novo. */
export async function bulkUpsertProcessos(userId: string, items: (ProcessoInput & { id?: string })[]): Promise<{ created: number; updated: number; error?: string }> {
  if (!sql) return { created: 0, updated: 0, error: "Banco não configurado." }
  const ok = await ensureProcessosTable()
  if (!ok) return { created: 0, updated: 0, error: "Tabela não disponível." }
  let created = 0
  let updated = 0
  for (const item of items) {
    if (item.id) {
      const existing = await getProcessoById(item.id)
      if (existing && existing.user_id === userId) {
        const err = await updateProcesso(item.id, item)
        if (err.error) return { created, updated, error: err.error }
        updated++
      }
    } else {
      const result = await createProcesso(userId, item)
      if ("error" in result) return { created, updated, error: result.error }
      created++
    }
  }
  return { created, updated }
}
