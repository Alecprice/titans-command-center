import { requireAdminAuth } from '../src/ingest.mjs';
import { probeFreeOddsProviders } from '../src/odds.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Allow','GET');
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const auth = requireAdminAuth(req, process.env);
  if (!auth.ok) return res.status(auth.status).json(auth);

  try {
    const compare = req.query?.compare !== 'false';
    const result = await probeFreeOddsProviders(process.env,{ compare });
    return res.status(result.ok ? 200 : 503).json(result);
  } catch (error) {
    console.error('[provider-health]', error);
    return res.status(502).json({ ok:false, error:'Provider health check failed' });
  }
}
