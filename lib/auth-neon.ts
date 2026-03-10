import { scrypt, randomBytes, timingSafeEqual } from "crypto"
import { promisify } from "util"
import { sql, ensureAuthTable } from "@/lib/db"

const scryptAsync = promisify(scrypt)
const SALT_LEN = 16
const KEY_LEN = 64
const COST = 16384

export interface AuthUser {
  id: string
  username: string
  password_hash: string
  created_at: Date
}

/** Gera hash da senha (salt:hex.hash:hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN)
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer
  return `${salt.toString("hex")}.${derived.toString("hex")}`
}

/** Verifica senha contra hash. */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(".")
  if (!saltHex || !keyHex) return false
  const salt = Buffer.from(saltHex, "hex")
  const key = Buffer.from(keyHex, "hex")
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer
  return key.length === derived.length && timingSafeEqual(key, derived)
}

/** Busca usuário por username (case-insensitive). */
export async function getUserByUsername(username: string): Promise<AuthUser | null> {
  if (!sql) return null
  const ok = await ensureAuthTable()
  if (!ok) return null
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null
  const rows = await sql`
    SELECT id, username, password_hash, created_at
    FROM auth_users
    WHERE LOWER(TRIM(username)) = ${normalized}
    LIMIT 1
  `
  const row = rows[0]
  if (!row || typeof row !== "object") return null
  const r = row as Record<string, unknown>
  return {
    id: String(r.id),
    username: String(r.username),
    password_hash: String(r.password_hash),
    created_at: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at)),
  }
}

/** Cria usuário. Retorna o usuário ou erro. */
export async function createUser(username: string, password: string): Promise<{ user: AuthUser } | { error: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const ok = await ensureAuthTable()
  if (!ok) return { error: "Não foi possível acessar a tabela de usuários." }

  const trimmed = username.trim()
  if (trimmed.length < 2) return { error: "Usuário deve ter pelo menos 2 caracteres." }
  if (password.length < 6) return { error: "Senha deve ter pelo menos 6 caracteres." }

  const passwordHash = await hashPassword(password)
  try {
    const rows = await sql`
      INSERT INTO auth_users (username, password_hash)
      VALUES (${trimmed}, ${passwordHash})
      RETURNING id, username, password_hash, created_at
    `
    const row = rows[0] as Record<string, unknown> | undefined
    if (!row) return { error: "Falha ao criar usuário." }
    return {
      user: {
        id: String(row.id),
        username: String(row.username),
        password_hash: String(row.password_hash),
        created_at: row.created_at instanceof Date ? row.created_at : new Date(String(row.created_at)),
      },
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (/unique|duplicate/i.test(msg)) return { error: "Este usuário já está em uso." }
    console.error("[auth-neon] createUser:", e)
    return { error: "Erro ao criar usuário. Tente novamente." }
  }
}

/** Busca usuário por id (auth_users). */
export async function getUserById(userId: string): Promise<AuthUser | null> {
  if (!sql) return null
  const ok = await ensureAuthTable()
  if (!ok) return null
  const id = String(userId).trim()
  if (!id) return null
  const rows = await sql`
    SELECT id, username, password_hash, created_at
    FROM auth_users
    WHERE id = ${id}
    LIMIT 1
  `
  const row = rows[0]
  if (!row || typeof row !== "object") return null
  const r = row as Record<string, unknown>
  return {
    id: String(r.id),
    username: String(r.username),
    password_hash: String(r.password_hash),
    created_at: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at)),
  }
}

/** Atualiza senha do usuário por id. */
export async function setPasswordByUserId(
  userId: string,
  password: string
): Promise<{ ok: true } | { error: string }> {
  if (!sql) return { error: "Banco não configurado." }
  const ok = await ensureAuthTable()
  if (!ok) return { error: "Não foi possível acessar a tabela de usuários." }
  if (password.length < 6) return { error: "Senha deve ter pelo menos 6 caracteres." }
  const user = await getUserById(userId)
  if (!user) return { error: "Usuário não encontrado." }
  const passwordHash = await hashPassword(password)
  try {
    await sql`
      UPDATE auth_users
      SET password_hash = ${passwordHash}
      WHERE id = ${userId}
    `
    return { ok: true }
  } catch (e) {
    console.error("[auth-neon] setPasswordByUserId:", e)
    return { error: "Erro ao atualizar senha." }
  }
}
