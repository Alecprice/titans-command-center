import { requireIngestAuth, syncBluesky, syncEspn, syncNflverseRoster, syncNflverseStats, syncNwsNextHomeGame, syncFreeOdds } from '../src/ingest.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Allow', 'GET');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const auth = requireIngestAuth(req, process.env);
  if (!auth.ok) return res.status(auth.status).json(auth);

  const jobs = [
    ['espn', () => syncEspn(process.env)],
    ['nflverse-roster', () => syncNflverseRoster(process.env, 2026)],
    ['nflverse-stats', () => syncNflverseStats(process.env, 2026)],
    ['nws-weather', () => syncNwsNextHomeGame(process.env)],
    ['bluesky', () => syncBluesky(process.env, 'Tennessee Titans', 30)],
    ['odds', () => (process.env.PROPLINE_API_KEY || process.env.ODDS_API_IO_KEY) ? syncFreeOdds(process.env) : Promise.resolve({ ok:false, skipped:true, error:'No free odds API key configured' })]
  ];
  const results = await Promise.all(jobs.map(async ([job, run]) => {
    try { return { job, ...(await run()) }; }
    catch (error) {
      console.error('[cron-refresh]', job, error);
      return { job, ok:false, error:'Sync job failed' };
    }
  }));
  const succeeded = results.filter(result => result.ok).length;
  const failed = results.length - succeeded;
  const ok = succeeded > 0;
  return res.status(ok ? 200 : 502).json({ ok, partial: failed > 0, succeeded, failed, mode: 'daily-deep-refresh', fetchedAt: new Date().toISOString(), results });
}
