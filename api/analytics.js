import { getAnalyticsExplorer } from '../src/db.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    const season = req.query?.season ? Number(req.query.season) : null;
    const side = String(req.query?.side || 'offense');
    const data = await getAnalyticsExplorer({ season, side }, process.env);
    if (!data.configured) return res.status(503).json({ ok:false, error:'Database not configured' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('[analytics]', error);
    return res.status(500).json({ ok:false, error:'Analytics query failed' });
  }
}
