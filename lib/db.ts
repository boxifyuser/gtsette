import { neon } from "@neondatabase/serverless"

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.warn("[db] DATABASE_URL ou POSTGRES_URL não definida. Auth Neon desabilitado.")
}

export const sql = connectionString ? neon(connectionString) : null

/** Tabela de usuários para auth com Neon. Execute uma vez no Neon (SQL abaixo) ou use a rota de registro. */
export const AUTH_USERS_TABLE = "auth_users"

let tableChecked = false

/** Garante que a tabela auth_users existe (chamado nas rotas de auth). */
export async function ensureAuthTable(): Promise<boolean> {
  if (!sql) return false
  if (tableChecked) return true
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS auth_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_auth_users_username ON auth_users(username)
    `
    tableChecked = true
    return true
  } catch (e) {
    console.error("[db] ensureAuthTable:", e)
    return false
  }
}

let cadastroTableChecked = false

/** Garante que a tabela user_cadastro existe (dados de cadastro do usuário logado). */
export async function ensureCadastroTable(): Promise<boolean> {
  if (!sql) return false
  if (cadastroTableChecked) return true
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_cadastro (
        user_id uuid PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
        nome_completo text NOT NULL,
        cpf text NOT NULL,
        email text NOT NULL,
        cnpj text,
        lgpd_consent boolean NOT NULL DEFAULT false,
        lgpd_consent_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`ALTER TABLE user_cadastro ADD COLUMN IF NOT EXISTS lgpd_consent boolean NOT NULL DEFAULT false`
    await sql`ALTER TABLE user_cadastro ADD COLUMN IF NOT EXISTS lgpd_consent_at timestamptz`
    /* Primeiro acesso: match por CPF + data nascimento + e-mail + telefone */
    await sql`ALTER TABLE user_cadastro ADD COLUMN IF NOT EXISTS data_nascimento text`
    await sql`ALTER TABLE user_cadastro ADD COLUMN IF NOT EXISTS telefone text`
    cadastroTableChecked = true
    return true
  } catch (e) {
    console.error("[db] ensureCadastroTable:", e)
    return false
  }
}

let adminTableChecked = false

/** Garante que a tabela admin_users existe. */
export async function ensureAdminTable(): Promise<boolean> {
  if (!sql) return false
  if (adminTableChecked) return true
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)`
    adminTableChecked = true
    return true
  } catch (e) {
    console.error("[db] ensureAdminTable:", e)
    return false
  }
}

let processosTableChecked = false

/** Processos de limpeza de nome por usuário (admin cria/edita/importa). */
export async function ensureProcessosTable(): Promise<boolean> {
  if (!sql) return false
  if (processosTableChecked) return true
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_processos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        tipo_processo text,
        status_processo text,
        observacoes text,
        data_atualizacao date,
        data_conclusao date,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_user_processos_user_id ON user_processos(user_id)`
    await sql`ALTER TABLE user_processos ADD COLUMN IF NOT EXISTS situacao_por_orgao jsonb DEFAULT '{}'`
    processosTableChecked = true
    return true
  } catch (e) {
    console.error("[db] ensureProcessosTable:", e)
    return false
  }
}

let processoOrgaosTableChecked = false

/** Órgãos para "Situação por órgão" (Serasa, SPC, etc.). Admin pode adicionar e ativar/desativar. */
export async function ensureProcessoOrgaosTable(): Promise<boolean> {
  if (!sql) return false
  if (processoOrgaosTableChecked) return true
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS processo_orgaos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nome text NOT NULL UNIQUE,
        ordem int NOT NULL DEFAULT 0,
        ativo boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_processo_orgaos_ativo ON processo_orgaos(ativo)`
    processoOrgaosTableChecked = true
    return true
  } catch (e) {
    console.error("[db] ensureProcessoOrgaosTable:", e)
    return false
  }
}
