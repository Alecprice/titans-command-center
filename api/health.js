import { databaseHealth } from '../src/db.mjs';

const providerConfig = env => ({
  propLine: Boolean(env.PROPLINE_API_KEY),
  oddsApiIo: Boolean(env.ODDS_API_IO_KEY),
  espnFallback: true,
  nws: true
});

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ok:false,error:'Method not allowed'});
  try {
    const db = await databaseHealth(process.env);
    res.status(db.ok ? 200 : 503).json({
      ok: db.ok,
      app: 'titans-command-center',
      version: '0.5.2',
      time: new Date().toISOString(),
      database: db,
      providers: providerConfig(process.env)
    });
  } catch (error) {
    console.error('[health]', error);
    res.status(503).json({
      ok: false,
      app: 'titans-command-center',
      version: '0.5.2',
      time: new Date().toISOString(),
      database: { configured: Boolean(process.env.DATABASE_URL), ok: false, error: 'Database health check failed' },
      providers: providerConfig(process.env)
    });
  }
}
