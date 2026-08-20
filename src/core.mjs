export const SOURCE_TIERS = {
  official: { label: 'Official', rank: 4 },
  media: { label: 'Media', rank: 3 },
  reporter: { label: 'Reporter', rank: 2 },
  community: { label: 'Community', rank: 1 }
};

export function sourceRank(tier) {
  return SOURCE_TIERS[tier]?.rank ?? 0;
}

export function filterFeed(items, filters = {}) {
  const query = (filters.query || '').trim().toLowerCase();
  return items.filter(item => {
    if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.tier && filters.tier !== 'all' && item.tier !== filters.tier) return false;
    if (filters.topic && filters.topic !== 'all' && !(item.topics || []).includes(filters.topic)) return false;
    if (query) {
      const haystack = [item.title, item.summary, item.source, ...(item.topics || [])].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  }).sort((a, b) => {
    const sourceDelta = sourceRank(b.tier) - sourceRank(a.tier);
    if (sourceDelta) return sourceDelta;
    const aTime = new Date(a.publishedAt).getTime();
    const bTime = new Date(b.publishedAt).getTime();
    if (!Number.isFinite(aTime) && !Number.isFinite(bTime)) return 0;
    if (!Number.isFinite(aTime)) return 1;
    if (!Number.isFinite(bTime)) return -1;
    return bTime - aTime;
  });
}

export function relativeTime(iso, now = new Date()) {
  const time = new Date(iso).getTime();
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (!Number.isFinite(time) || !Number.isFinite(nowTime)) return 'Time unavailable';
  const diff = time - nowTime;
  const mins = Math.round(Math.abs(diff) / 60000);
  if (mins < 60) return diff < 0 ? `${mins}m ago` : `in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff < 0 ? `${hours}h ago` : `in ${hours}h`;
  const days = Math.round(hours / 24);
  return diff < 0 ? `${days}d ago` : `in ${days}d`;
}

export function gameStatus(game, now = new Date()) {
  if (game.status === 'bye') return 'Bye';
  if (game.status === 'final') return 'Final';
  if (game.status === 'live') return game.detail || 'Live';
  if (game.dateTbd || !game.date) return 'TBD';
  const start = new Date(game.date);
  const diff = start - now;
  if (!Number.isFinite(diff)) return 'TBD';
  if (diff <= 0) return 'Scheduled';
  const days = Math.floor(diff / 86400000);
  if (days >= 1) return `${days}d away`;
  const hours = Math.max(1, Math.round(diff / 3600000));
  return `${hours}h away`;
}

export function normalizeEspnEvent(event) {
  const competition = event?.competitions?.[0];
  const competitors = competition?.competitors || [];
  const ten = competitors.find(c => c.team?.abbreviation === 'TEN');
  const opp = competitors.find(c => c.team?.abbreviation !== 'TEN');
  if (!ten || !opp) return null;
  return {
    id: event.id,
    week: event.week?.number || null,
    date: event.date,
    opponent: opp.team?.displayName || 'Opponent',
    opponentAbbr: opp.team?.abbreviation || '',
    homeAway: ten.homeAway,
    status: event.status?.type?.completed ? 'final' : event.status?.type?.state === 'in' ? 'live' : 'scheduled',
    detail: event.status?.type?.detail || '',
    score: ten.score,
    opponentScore: opp.score,
    venue: competition?.venue?.fullName || '',
    source: 'ESPN'
  };
}

export function mergeLiveGames(existingGames, liveGames) {
  const merged = [...existingGames];
  for (const live of liveGames) {
    const liveDate = new Date(live.date).getTime();
    const index = merged.findIndex(game =>
      game.date &&
      game.opponentAbbr === live.opponentAbbr &&
      game.homeAway === live.homeAway &&
      Math.abs(new Date(game.date).getTime() - liveDate) <= 48 * 60 * 60 * 1000
    );
    if (index >= 0) {
      const canonical = merged[index];
      merged[index] = { ...canonical, ...live, id: canonical.id, week: canonical.week, source: `${canonical.source || 'verified schedule'} + ESPN` };
    } else merged.push(live);
  }
  return merged.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
}