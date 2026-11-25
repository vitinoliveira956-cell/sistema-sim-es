import { getStore } from '@netlify/blobs';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

const store = getStore({ name: 'simoes-site' });
const SALT_KEY = 'admin-salt';
const HASH_KEY = 'admin-hash';
const CONTENT_KEY = 'content';

function hashPassword(password, salt) {
  return scryptSync(String(password), salt, 64).toString('hex');
}

export function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(data)
  };
}

async function ensureAdmin() {
  let salt = await store.get(SALT_KEY, { type: 'text' });
  let hash = await store.get(HASH_KEY, { type: 'text' });

  if (!salt || !hash) {
    salt = randomBytes(16).toString('hex');
    // Defina ADMIN_PASSWORD nas variáveis de ambiente do Netlify.
    const initial = process.env.ADMIN_PASSWORD || 'simoes2026';
    hash = hashPassword(initial, salt);
    await store.set(SALT_KEY, salt);
    await store.set(HASH_KEY, hash);
  }
  return { salt, hash };
}

export async function checkPassword(password) {
  if (!password) return false;
  const { salt, hash } = await ensureAdmin();
  const candidate = Buffer.from(hashPassword(password, salt), 'hex');
  const stored = Buffer.from(hash, 'hex');
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export async function setPassword(password) {
  const salt = randomBytes(16).toString('hex');
  await store.set(SALT_KEY, salt);
  await store.set(HASH_KEY, hashPassword(password, salt));
}

export async function getContent() {
  return store.get(CONTENT_KEY, { type: 'json' });
}

export async function setContent(content) {
  await store.setJSON(CONTENT_KEY, content);
}

export async function deleteContent() {
  await store.delete(CONTENT_KEY);
}
