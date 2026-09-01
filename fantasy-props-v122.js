(() => {
  'use strict';
  const ROUTE = 'fantasy';
  const ID = 'fantasy-live-props-v122';
  const API = '/api/fantasy-props';
  const BOOKS = [
    { key: 'draftkings', label: 'DraftKings' },
    { key: 'fanduel', label: 'FanDuel' },
    { key: 'betmgm', label: 'BetMGM' }
  ];
  const state = { data: null, error: '', loading: false, loadedAt: 0, player: '', market: 'all' };
  let requestSerial = 0;

  const route = () => location.hash.replace(/^#/, '').split('?')[0] || 'home';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const root = () => document.querySelector(`#${ID}`);
  const formatOdds = value => {
    const n = Number(value);
    if (!Number.isFinite(n) || n === 0) return '—';
    return n > 0 ? `+${Math.round(n)}` : String(Math.round(n));
  };
  const formatLine = value => Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—';
  const formatTime = value => {
    if (!value) return 'No timestamp';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'No timestamp';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
  };
  const latestCapture = data => (data?.sources || []).map(source => source.capturedAt).filter(Boolean).sort().at(-1) || data?.fetchedAt || null;

  function sourceCards(data) {
    const byKey = new Map((data?.sources || []).map(source => [source.key, source]));
    return `<div class="fprop-sources" aria-label="Player prop locations">${BOOKS.map(book => {
      const source = byKey.get(book.key) || { available: false, rowCount: 0, capturedAt: null };
      return `<div class="fprop-source ${source.available ? 'is-reporting' : 'is-missing'}"><div><strong>${book.label}</strong><span>${source.available ? `${source.rowCount} current prop${source.rowCount === 1 ? '' : 's'}` : 'No current props'}</span></div><em>${source.available ? 'REPORTING' : 'NOT REPORTING'}</em></div>`;
    }).join('')}</div>`;
  }

  function filterControls(data) {
    const markets = [...new Set((data?.props || []).map(prop => prop.marketLabel).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    if (state.market !== 'all' && !markets.includes(state.market)) state.market = 'all';
    return `<div class="fprop-controls"><label><span>Find player</span><input id="fprop-player-filter" type="search" maxlength="60" value="${esc(state.player)}" placeholder="Search player name" autocomplete="off"></label><label><span>Prop market</span><select id="fprop-market-filter"><option value="all">All current props</option>${markets.map(market => `<option value="${esc(market)}"${state.market === market ? ' selected' : ''}>${esc(market)}</option>`).join('')}</select></label></div>`;
  }

  function quoteCell(prop, book) {
    const quote = prop?.books?.[book.key];
    if (!quote) return `<div class="fprop-quote is-empty"><strong>${book.label}</strong><span>Not reporting</span></div>`;
    return `<div class="fprop-quote"><strong>${book.label}</strong><div class="fprop-line"><span>Line</span><b>${formatLine(quote.line)}</b></div><div class="fprop-prices"><span>O <b>${formatOdds(quote.overPrice)}</b></span><span>U <b>${formatOdds(quote.underPrice)}</b></span></div><small>${quote.live ? 'Live' : 'Current'} · ${esc(formatTime(quote.capturedAt))}</small></div>`;
  }

  function filteredProps(data) {
    const needle = state.player.trim().toLowerCase();
    return (data?.props || []).filter(prop => (!needle || String(prop.playerName || '').toLowerCase().includes(needle)) && (state.market === 'all' || prop.marketLabel === state.market));
  }

  function propRows(data) {
    const matches = filteredProps(data);
    const shown = matches.slice(0, 36);
    if (!shown.length) return `<div class="fprop-empty">${data?.available ? 'No current props match those filters.' : 'No current Titans matchup player props are reporting from the requested books. Lines often publish closer to kickoff.'}</div>`;
    return `<div class="fprop-board" role="table" aria-label="Titans matchup player props"><div class="fprop-table-head" role="row"><span role="columnheader">Player / prop</span>${BOOKS.map(book => `<span role="columnheader">${book.label}</span>`).join('')}</div>${shown.map(prop => `<article class="fprop-row" role="row"><div class="fprop-player" role="rowheader"><strong>${esc(prop.playerName)}</strong><span>${esc(prop.marketLabel)}</span></div>${BOOKS.map(book => quoteCell(prop, book)).join('')}</article>`).join('')}</div>${matches.length > shown.length ? `<p class="fprop-limit">Showing 36 of ${matches.length} matching props. Narrow by player or market to see more.</p>` : ''}`;
  }

  function loadingMarkup() {
    return `<div class="fprop-shell"><div class="fprop-top"><div><div class="fprop-kicker">LIVE PLAYER PROP BOARD</div><h2>Titans matchup props across 3 books</h2><p>Loading current player prop lines from DraftKings, FanDuel and BetMGM…</p></div><button type="button" class="fprop-refresh" disabled>Loading…</button></div><div class="fprop-loading" role="status">Checking current provider coverage.</div></div>`;
  }

  function render() {
    const node = root();
    if (!node) return;
    if (state.loading && !state.data) { node.innerHTML = loadingMarkup(); return; }
    const data = state.data || { available: false, sources: [], coverage: { requested: 3, reporting: 0 }, props: [] };
    const reporting = Number(data?.coverage?.reporting || 0);
    const event = data?.event;
    const eventText = event?.label ? `${event.label}${event.startTime ? ` · ${formatTime(event.startTime)}` : ''}` : 'Next/current Tennessee Titans matchup';
    const statusText = state.error ? 'Provider check degraded' : `${reporting} of 3 books reporting`;
    node.innerHTML = `<div class="fprop-shell"><div class="fprop-top"><div><div class="fprop-kicker">LIVE PLAYER PROP BOARD</div><h2>Titans matchup props across 3 books</h2><p>${esc(eventText)}. Compare current lines by source; no projection or recommendation is invented here.</p></div><button type="button" class="fprop-refresh" id="fprop-refresh"${state.loading ? ' disabled' : ''}>${state.loading ? 'Refreshing…' : 'Refresh props'}</button></div><div class="fprop-meta"><span class="${reporting ? 'is-live' : ''}">${esc(statusText)}</span><span>Updated ${esc(formatTime(latestCapture(data)))}</span><span>Provider: ${esc(data.provider || 'free-odds-stack')}</span></div>${state.error ? `<div class="fprop-warning" role="status">${esc(state.error)}. Showing any current lines that remain available.</div>` : ''}${sourceCards(data)}${filterControls(data)}${propRows(data)}<p class="fprop-note">Odds are informational and can move quickly. “Reporting” means the source returned a current line for this Titans matchup; a missing book is shown as unavailable rather than estimated.</p></div>`;
    bind();
  }

  function bind() {
    root()?.querySelector('#fprop-refresh')?.addEventListener('click', () => load(true));
    root()?.querySelector('#fprop-player-filter')?.addEventListener('input', event => { state.player = event.target.value; render(); });
    root()?.querySelector('#fprop-market-filter')?.addEventListener('change', event => { state.market = event.target.value; render(); });
  }

  async function load(force = false) {
    if (state.loading) return;
    if (!force && state.data && Date.now() - state.loadedAt < 120000) { render(); return; }
    state.loading = true;
    state.error = '';
    render();
    const serial = ++requestSerial;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(API, { headers: { Accept: 'application/json' }, signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `Props service returned ${response.status}`);
      if (serial !== requestSerial || route() !== ROUTE) return;
      state.data = payload;
      state.loadedAt = Date.now();
      const diagnostic = Array.isArray(payload?.diagnostics) ? payload.diagnostics.find(item => item?.ok === false) : null;
      state.error = diagnostic?.error || '';
    } catch (error) {
      if (serial !== requestSerial || route() !== ROUTE) return;
      state.error = error?.name === 'AbortError' ? 'Current player props timed out' : String(error?.message || 'Current player props are unavailable');
    } finally {
      clearTimeout(timer);
      if (serial === requestSerial) state.loading = false;
      if (route() === ROUTE) render();
    }
  }

  function mount() {
    if (route() !== ROUTE) return;
    const app = document.querySelector('#app');
    const tabs = app?.querySelector('.fantasy-tabs');
    if (!app || !tabs) return;
    if (!root()) {
      const section = document.createElement('section');
      section.id = ID;
      section.className = 'fantasy-live-props';
      section.setAttribute('aria-label', 'Live player prop board');
      tabs.insertAdjacentElement('afterend', section);
    }
    load(false);
  }

  const app = document.querySelector('#app');
  const observer = new MutationObserver(() => queueMicrotask(mount));
  if (app) observer.observe(app, { childList: true });
  addEventListener('hashchange', () => {
    requestSerial++;
    state.loading = false;
    if (route() === ROUTE) queueMicrotask(mount);
  });
  queueMicrotask(mount);
})();
