import { getBootstrapData } from '../src/db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ok:false,error:'Method not allowed'});
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
  try {
    const data = await getBootstrapData(process.env);
    if (!data.configured) return res.status(503).json({ ok: false, configured: false, error: 'DATABASE_URL is not configured' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('[data]', error);
    return res.status(500).json({ ok: false, configured: true, error: 'Database query failed' });
  }
}
