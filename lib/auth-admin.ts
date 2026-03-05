import { scrypt, randomBytes, timingSafeEqual } from "crypto"
import { promisify } from "util"
import { sql, ensureAdminTable } from "@/lib/db"

const scryptAsync = promisify(scrypt)
const SALT_LEN = 16
const KEY_LEN = 64

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  created_at: Date
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN)
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer
  return `${salt.toString("hex")}.${derived.toString("hex")}`
}

export async function verifyAdminPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(".")
  if (!saltHex || !keyHex) return false
  const salt = Buffer.from(saltHex, "hex")
  const key = Buffer.from(keyHex, "hex")
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer
  return key.length === derived.length && timingSafeEqual(key, derived)
}

export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  if (!sql) return null
  const ok = await ensureAdminTable()
  if (!ok) return null
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null
  const rows = await sql`
    SELECT id, username, password_hash, created_at
    FROM admin_users
    WHERE LOWER(TRIM(username)) = ${normalized}
    LIMIT 1
  `
  const row = rows[0] as Record<string, unknown> | undefined
  if (!row) return null
  return {
    id: String(row.id),
    username: String(row.username),
    password_hash: String(row.password_hash),
    created_at: row.created_at instanceof Date ? row.created_at : new Date(String(row.created_at)),
  }
}

/** Cria primeiro admin (use uma vez; requer ADMIN_SEED_USERNAME e ADMIN_SEED_PASSWORD no .env). */
export async function seedAdminIfEmpty(): Promise<{ created: boolean; error?: string }> {
  if (!sql) return { created: false, error: "Banco não configurado." }
  const ok = await ensureAdminTable()
  if (!ok) return { created: false, error: "Tabela admin não disponível." }
  const existing = await sql`SELECT 1 FROM admin_users LIMIT 1`
  if (existing.length > 0) return { created: false }
  const user = process.env.ADMIN_SEED_USERNAME?.trim()
  const pass = process.env.ADMIN_SEED_PASSWORD
  if (!user || !pass || pass.length < 6) return { created: false, error: "Configure ADMIN_SEED_USERNAME e ADMIN_SEED_PASSWORD (mín. 6 caracteres)." }
  const passwordHash = await hashPassword(pass)
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${user}, ${passwordHash})
  `
  return { created: true }
}
