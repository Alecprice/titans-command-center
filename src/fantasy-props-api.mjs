import { americanToImplied, decimalToAmerican, fetchFreeOdds, selectTitansEvents } from './odds.mjs';

export const FANTASY_PROP_BOOKS = Object.freeze([
  { key: 'draftkings', label: 'DraftKings' },
  { key: 'fanduel', label: 'FanDuel' },
  { key: 'betmgm', label: 'BetMGM' }
]);

const clean = value => String(value ?? '').trim();
const slug = value => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const bookKey = value => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
const number = value => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};
const timestamp = (...values) => {
  for (const value of values) {
    if (!value) continue;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
};
const oddsPrice = value => {
  const n = number(value);
  if (n == null || n === 0) return null;
  if (n > 1 && n < 20) return decimalToAmerican(n);
  return Math.round(n);
};
const marketOrder = label => {
  const value = clean(label).toLowerCase();
  if (/passing yards/.test(value)) return 1;
  if (/rushing yards/.test(value)) return 2;
  if (/receiv(?:ing|ed) yards/.test(value)) return 3;
  if (/receptions/.test(value)) return 4;
  if (/passing touchdowns|passing tds/.test(value)) return 5;
  if (/touchdown/.test(value)) return 6;
  return 20;
};
const normalizeBook = value => {
  const key = bookKey(value);
  return FANTASY_PROP_BOOKS.find(book => bookKey(book.label) === key || book.key === key) || null;
};
const requestedBooks = env => {
  const configured = clean(env?.ODDS_API_IO_BOOKS).split(',').map(clean).filter(Boolean);
  const resolved = configured.map(normalizeBook).filter(Boolean);
  const unique = [];
  for (const book of [...resolved, ...FANTASY_PROP_BOOKS]) {
    if (!unique.some(item => item.key === book.key)) unique.push(book);
    if (unique.length === 3) break;
  }
  return unique;
};
const eventId = event => clean(event?.id ?? event?.eventId ?? event?.key);
const eventLabel = event => {
  const away = clean(event?.away_team ?? event?.awayTeam ?? event?.away?.name);
  const home = clean(event?.home_team ?? event?.homeTeam ?? event?.home?.name);
  return away && home ? `${away} at ${home}` : clean(event?.name ?? event?.title ?? 'Tennessee Titans');
};
const eventStart = event => event?.commence_time ?? event?.commenceTime ?? event?.start_time ?? event?.startTime ?? event?.date ?? event?.start ?? null;
const isLiveEvent = event => Boolean(event?.live) || /live|in progress|in_progress/i.test(clean(event?.status ?? event?.state));

function splitPlayerMarket(label, marketName) {
  const raw = clean(label);
  if (!raw) return null;
  const parts = raw.split(/\s+-\s+/).map(clean).filter(Boolean);
  if (parts.length >= 2) {
    return { playerName: parts.shift(), marketLabel: parts.join(' - ') };
  }
  const market = clean(marketName);
  if (market && !/^player props?$/i.test(market)) return { playerName: raw, marketLabel: market.replace(/^player props?\s*[-:]?\s*/i, '') || market };
  return null;
}

function bookmakerEntries(payload) {
  const books = payload?.bookmakers;
  if (Array.isArray(books)) {
    return books.map(book => [clean(book?.title ?? book?.name ?? book?.key ?? book?.id), book]);
  }
  if (books && typeof books === 'object') return Object.entries(books);
  return [];
}

function marketEntries(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.markets)) return value.markets;
  if (value?.markets && typeof value.markets === 'object') return Object.values(value.markets);
  return [];
}

function primaryScore(quote) {
  const prices = [quote.overPrice, quote.underPrice].map(americanToImplied).filter(v => v != null);
  if (!prices.length) return 10;
  return prices.reduce((sum, p) => sum + Math.abs(p - 0.5), 0) / prices.length;
}

export function normalizeOddsApiIoPlayerProps(payload, { books = FANTASY_PROP_BOOKS, fetchedAt = new Date().toISOString() } = {}) {
  const allowed = new Map(books.map(book => [bookKey(book.label), book]));
  const quotes = [];
  for (const [rawBookName, rawBook] of bookmakerEntries(payload)) {
    const book = allowed.get(bookKey(rawBookName)) || normalizeBook(rawBookName);
    if (!book || !books.some(item => item.key === book.key)) continue;
    for (const market of marketEntries(rawBook)) {
      const marketName = clean(market?.name ?? market?.title ?? market?.label ?? 'Player Props');
      const outcomes = Array.isArray(market?.odds) ? market.odds : Array.isArray(market?.outcomes) ? market.outcomes : [];
      for (const outcome of outcomes) {
        const identity = splitPlayerMarket(outcome?.label ?? outcome?.name ?? outcome?.player, marketName);
        if (!identity?.playerName || !identity?.marketLabel) continue;
        const line = number(outcome?.hdp ?? outcome?.line ?? outcome?.point ?? outcome?.total);
        const overPrice = oddsPrice(outcome?.over ?? outcome?.overOdds ?? outcome?.over_odds);
        const underPrice = oddsPrice(outcome?.under ?? outcome?.underOdds ?? outcome?.under_odds);
        if (line == null || (overPrice == null && underPrice == null)) continue;
        quotes.push({
          bookKey: book.key,
          bookLabel: book.label,
          playerName: identity.playerName,
          marketKey: slug(identity.marketLabel),
          marketLabel: identity.marketLabel,
          line,
          overPrice,
          underPrice,
          live: Boolean(outcome?.live ?? market?.live ?? payload?.live),
          capturedAt: timestamp(outcome?.updatedAt, outcome?.updated_at, market?.updatedAt, market?.updated_at, rawBook?.updatedAt, rawBook?.updated_at, payload?.updatedAt, payload?.updated_at, fetchedAt)
        });
      }
    }
  }
  return quotes;
}

function normalizedFallbackQuotes(rows, books) {
  const allowed = new Map(books.map(book => [bookKey(book.label), book]));
  const grouped = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row?.category !== 'player_prop' || row?.available === false || !clean(row?.entityName)) continue;
    const book = allowed.get(bookKey(row?.book));
    if (!book) continue;
    const line = number(row?.line);
    const price = oddsPrice(row?.price);
    if (line == null || price == null) continue;
    const marketLabel = clean(row?.marketName ?? row?.marketKey ?? 'Player Prop');
    const key = [book.key, clean(row.entityName).toLowerCase(), slug(marketLabel), line].join('|');
    const quote = grouped.get(key) || {
      bookKey: book.key,
      bookLabel: book.label,
      playerName: clean(row.entityName),
      marketKey: slug(marketLabel),
      marketLabel,
      line,
      overPrice: null,
      underPrice: null,
      live: Boolean(row?.live),
      capturedAt: timestamp(row?.capturedAt)
    };
    const side = clean(row?.side).toLowerCase();
    if (side === 'over') quote.overPrice = price;
    else if (side === 'under') quote.underPrice = price;
    else continue;
    grouped.set(key, quote);
  }
  return [...grouped.values()].filter(quote => quote.overPrice != null || quote.underPrice != null);
}

export function buildFantasyPropBoard(quotes, books = FANTASY_PROP_BOOKS) {
  const groups = new Map();
  for (const quote of Array.isArray(quotes) ? quotes : []) {
    const groupKey = `${clean(quote.playerName).toLowerCase()}|${clean(quote.marketKey || slug(quote.marketLabel))}`;
    if (!groups.has(groupKey)) groups.set(groupKey, { playerName: clean(quote.playerName), marketKey: clean(quote.marketKey || slug(quote.marketLabel)), marketLabel: clean(quote.marketLabel), books: {} });
    const group = groups.get(groupKey);
    const existing = group.books[quote.bookKey];
    if (!existing || primaryScore(quote) < primaryScore(existing)) group.books[quote.bookKey] = quote;
  }
  const props = [...groups.values()].filter(group => Object.keys(group.books).length).sort((a, b) =>
    a.playerName.localeCompare(b.playerName) || marketOrder(a.marketLabel) - marketOrder(b.marketLabel) || a.marketLabel.localeCompare(b.marketLabel)
  ).slice(0, 80);
  const sources = books.map(book => {
    const bookQuotes = props.flatMap(prop => prop.books[book.key] ? [prop.books[book.key]] : []);
    return {
      key: book.key,
      label: book.label,
      available: bookQuotes.length > 0,
      rowCount: bookQuotes.length,
      capturedAt: bookQuotes.map(quote => quote.capturedAt).filter(Boolean).sort().at(-1) || null
    };
  });
  return { props, sources, coverage: { requested: books.length, reporting: sources.filter(source => source.available).length } };
}

async function getJson(url, options = {}) {
  const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(6500) : undefined;
  const response = await fetch(url, { ...options, signal });
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  return response.json();
}

async function fetchOddsApiIoProps(env, books) {
  if (!env?.ODDS_API_IO_KEY) return { ok: false, configured: false, quotes: [], event: null, provider: 'Odds-API.io' };
  const apiKey = clean(env.ODDS_API_IO_KEY);
  const eventsUrl = new URL('https://api.odds-api.io/v3/events');
  eventsUrl.searchParams.set('apiKey', apiKey);
  eventsUrl.searchParams.set('sport', 'nfl');
  eventsUrl.searchParams.set('limit', '100');
  const eventsPayload = await getJson(eventsUrl);
  const event = selectTitansEvents(eventsPayload, 1)[0] || null;
  if (!event || !eventId(event)) return { ok: true, configured: true, quotes: [], event: null, provider: 'Odds-API.io' };
  const oddsUrl = new URL('https://api.odds-api.io/v3/odds');
  oddsUrl.searchParams.set('apiKey', apiKey);
  oddsUrl.searchParams.set('eventId', eventId(event));
  oddsUrl.searchParams.set('bookmakers', books.map(book => book.label).join(','));
  const fetchedAt = new Date().toISOString();
  const oddsPayload = await getJson(oddsUrl);
  return { ok: true, configured: true, quotes: normalizeOddsApiIoPlayerProps(oddsPayload, { books, fetchedAt }), event, provider: 'Odds-API.io', fetchedAt };
}

export async function loadFantasyProps(env = process.env) {
  const books = requestedBooks(env);
  let direct = { ok: false, configured: false, quotes: [], event: null, provider: 'Odds-API.io' };
  let directError = null;
  if (env?.ODDS_API_IO_KEY) {
    try { direct = await fetchOddsApiIoProps(env, books); }
    catch (error) { directError = clean(error?.message || 'Odds-API.io unavailable'); }
  }

  let quotes = [...(direct.quotes || [])];
  let fallbackProvider = null;
  const directCoverage = buildFantasyPropBoard(quotes, books).coverage.reporting;
  if (directCoverage < books.length && env?.PROPLINE_API_KEY) {
    try {
      const fallback = await fetchFreeOdds(env, { maxEvents: 1 });
      if (fallback?.ok) {
        const fallbackQuotes = normalizedFallbackQuotes(fallback.odds, books);
        const directBooks = new Set(quotes.map(quote => quote.bookKey));
        quotes.push(...fallbackQuotes.filter(quote => !directBooks.has(quote.bookKey)));
        fallbackProvider = fallback.provider || 'PropLine';
        if (!direct.event && fallback.events?.[0]) direct.event = fallback.events[0];
      }
    } catch {}
  }

  const board = buildFantasyPropBoard(quotes, books);
  const event = direct.event;
  const fetchedAt = direct.fetchedAt || new Date().toISOString();
  return {
    ok: true,
    available: board.props.length > 0,
    provider: direct.configured ? 'Odds-API.io' : (fallbackProvider || 'free-odds-stack'),
    fallbackProvider,
    requestedBooks: books.map(book => book.label),
    sources: board.sources,
    coverage: board.coverage,
    event: event ? { id: eventId(event), label: eventLabel(event), startTime: eventStart(event), live: isLiveEvent(event) } : null,
    props: board.props,
    fetchedAt,
    diagnostics: directError ? [{ provider: 'Odds-API.io', ok: false, error: directError }] : []
  };
}

function methodOnly(req, res, allowed) {
  res.setHeader('Allow', allowed);
  if (req.method !== allowed) { res.status(405).json({ ok: false, error: 'Method not allowed' }); return true; }
  return false;
}

export async function fantasyPropsRoute(req, res, env = process.env) {
  if (methodOnly(req, res, 'GET')) return;
  const extraQuery = Object.keys(req.query || {}).filter(key => key !== 'route');
  if (extraQuery.length) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ ok: false, error: 'Fantasy props endpoint does not accept query parameters' });
  }
  try {
    const payload = await loadFantasyProps(env);
    res.setHeader('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=300');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[fantasy-props]', error);
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({
      ok: true,
      available: false,
      provider: 'free-odds-stack',
      requestedBooks: FANTASY_PROP_BOOKS.map(book => book.label),
      sources: FANTASY_PROP_BOOKS.map(book => ({ ...book, available: false, rowCount: 0, capturedAt: null })),
      coverage: { requested: 3, reporting: 0 },
      event: null,
      props: [],
      fetchedAt: new Date().toISOString(),
      diagnostics: [{ provider: 'fantasy-props', ok: false, error: 'Current player props are temporarily unavailable' }]
    });
  }
}
