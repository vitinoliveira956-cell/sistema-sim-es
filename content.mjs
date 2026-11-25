import { checkPassword, setPassword, getContent, setContent, deleteContent, json } from './_lib.mjs';

export async function handler(event) {
  const method = event.httpMethod;
  const password = event.headers['x-admin-password'] || '';

  // Leitura é pública: todo visitante recebe o conteúdo atual.
  if (method === 'GET') {
    const content = await getContent();
    return json(200, { content: content || null });
  }

  // Escrita e restauração exigem a senha do administrador.
  if (!(await checkPassword(password))) {
    return json(401, { error: 'Senha incorreta' });
  }

  if (method === 'PUT') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return json(400, { error: 'JSON inválido' });
    }
    if (!body.content || typeof body.content !== 'object') {
      return json(400, { error: 'Conteúdo inválido' });
    }

    if (body.newPassword) {
      const next = String(body.newPassword);
      if (next.length < 6) {
        return json(400, { error: 'A nova senha precisa ter ao menos 6 caracteres' });
      }
      await setPassword(next);
    }

    await setContent(body.content);
    return json(200, { ok: true });
  }

  if (method === 'DELETE') {
    await deleteContent();
    return json(200, { ok: true });
  }

  return json(405, { error: 'Método não permitido' });
}
