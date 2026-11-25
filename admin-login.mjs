import { checkPassword, json } from './_lib.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Método não permitido' });
  }

  const password = event.headers['x-admin-password'] || '';
  if (!password) {
    return json(400, { error: 'Digite a senha' });
  }
  if (!(await checkPassword(password))) {
    return json(401, { error: 'Senha incorreta' });
  }

  return json(200, { ok: true });
}
