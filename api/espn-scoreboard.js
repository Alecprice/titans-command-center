export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  const url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': 'TitansCommandCenter/0.5.2' }, signal: AbortSignal.timeout(4500) });
    if (!upstream.ok) throw new Error(`ESPN returned ${upstream.status}`);
    const json = await upstream.json();
    res.status(200).json({ ok: true, provider: 'ESPN', unofficial: true, fetchedAt: new Date().toISOString(), payload: json });
  } catch (error) {
    res.status(502).json({ ok: false, provider: 'ESPN', unofficial: true, error: 'Live scoreboard provider unavailable', detail: String(error?.message || error) });
  }
}
