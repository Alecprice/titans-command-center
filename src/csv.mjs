export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h, i) => (i === 0 ? h.replace(/^\uFEFF/, '') : h).trim());
  return rows.slice(1).filter(r => r.some(v => v !== '')).map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])));
}

export async function fetchCsv(url, options = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(options.timeoutMs || 15000), headers: options.headers || {} });
  if (!response.ok) throw new Error(`CSV source returned ${response.status}`);
  return parseCsv(await response.text());
}

export async function* streamCsvRowsFromReadable(readable) {
  if (!readable?.getReader) throw new Error('ReadableStream is required');
  const reader = readable.getReader();
  const decoder = new TextDecoder();
  let headers = null;
  let row = [];
  let field = '';
  let quoted = false;
  let pendingQuote = false;

  const completed = [];
  const pushRow = () => {
    row.push(field.replace(/\r$/, ''));
    field = '';
    if (headers === null) headers = row.map((h, i) => (i === 0 ? h.replace(/^\uFEFF/, '') : h).trim());
    else if (row.some(v => v !== '')) completed.push(Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])));
    row = [];
  };

  const process = text => {
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (pendingQuote) {
        if (ch === '"') { field += '"'; pendingQuote = false; continue; }
        quoted = false;
        pendingQuote = false;
      }
      if (quoted) {
        if (ch === '"') {
          if (i + 1 < text.length) {
            if (text[i + 1] === '"') { field += '"'; i += 1; }
            else quoted = false;
          } else pendingQuote = true;
        } else field += ch;
        continue;
      }
      if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') pushRow();
      else field += ch;
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    process(decoder.decode(value, { stream: true }));
    while (completed.length) yield completed.shift();
  }
  process(decoder.decode());
  if (pendingQuote) { pendingQuote = false; quoted = false; }
  if (field.length || row.length) pushRow();
  while (completed.length) yield completed.shift();
}

export async function* streamCsv(url, options = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(options.timeoutMs || 120000), headers: options.headers || {} });
  if (!response.ok) throw new Error(`CSV source returned ${response.status}`);
  yield* streamCsvRowsFromReadable(response.body);
}

export const numberOrNull = value => value === '' || value == null || Number.isNaN(Number(value)) ? null : Number(value);
export const textOrNull = value => value == null || String(value).trim() === '' || String(value).trim().toUpperCase() === 'NA' ? null : String(value).trim();
