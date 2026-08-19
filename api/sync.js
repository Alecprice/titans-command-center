import { requireIngestAuth, syncBluesky, syncEspn, syncNflverseRoster, syncNflverseStats, syncNwsNextHomeGame, syncFreeOdds } from '../src/ingest.mjs';

const jobs = {
  espn: () => syncEspn(process.env),
  bluesky: () => syncBluesky(process.env, 'Tennessee Titans', 30),
  'nflverse-roster': () => syncNflverseRoster(process.env, 2026),
  'nflverse-stats': () => syncNflverseStats(process.env, 2026),
  'nws-weather': () => syncNwsNextHomeGame(process.env),
  odds: () => syncFreeOdds(process.env)
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Allow', 'POST');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed; ingestion requires POST' });

  const auth = requireIngestAuth(req, process.env);
  if (!auth.ok) return res.status(auth.status).json(auth);

  const requested = String(req.query?.job || '').trim();
  if (!requested) return res.status(400).json({ ok:false, error:'job query parameter is required', availableJobs:Object.keys(jobs) });
  const selected = requested.split(',').map(v => v.trim()).filter(Boolean);
  const invalid = selected.filter(job => !jobs[job]);
  if (invalid.length) return res.status(400).json({ ok: false, error: `Unknown job(s): ${invalid.join(', ')}`, availableJobs: Object.keys(jobs) });

  const results = [];
  for (const job of selected) {
    try { results.push({ job, ...(await jobs[job]()) }); }
    catch (error) {
      console.error('[sync]', job, error);
      results.push({ job, ok: false, error: 'Sync job failed' });
    }
  }
  const ok = results.length > 0 && results.some(result => result.ok);
  return res.status(ok ? 200 : 502).json({ ok, fetchedAt: new Date().toISOString(), results });
}
