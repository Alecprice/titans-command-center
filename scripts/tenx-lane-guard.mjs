import { appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const API_VERSION = '2026-03-10';
const PAGE_SIZE = 100;
const MAX_PAGES = 30;

export function detectCollisions(currentFiles, openPullRequests) {
  const current = new Set((currentFiles || []).filter(Boolean));
  const collisions = [];

  for (const pull of openPullRequests || []) {
    const reserved = new Set((pull.files || []).filter(Boolean));
    const overlap = [...current].filter(file => reserved.has(file)).sort();
    if (!overlap.length) continue;
    collisions.push({
      number: Number(pull.number),
      title: String(pull.title || ''),
      head: String(pull.head || ''),
      draft: Boolean(pull.draft),
      files: overlap
    });
  }

  return collisions.sort((a, b) => a.number - b.number);
}

function markdownEscape(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function collisionSummary(currentPr, collisions) {
  if (!collisions.length) {
    return `### TENX lane guard\n\nPR #${currentPr} has no file overlap with another open pull request targeting the same base branch.\n`;
  }

  const lines = [
    '### TENX lane guard — collision detected',
    '',
    `PR #${currentPr} overlaps ${collisions.length} active pull request lane${collisions.length === 1 ? '' : 's'}.`,
    '',
    '| Reserved by | Branch | State | Overlapping files |',
    '| --- | --- | --- | --- |'
  ];

  for (const collision of collisions) {
    lines.push(`| #${collision.number} ${markdownEscape(collision.title)} | \`${markdownEscape(collision.head)}\` | ${collision.draft ? 'draft' : 'open'} | ${collision.files.map(file => `\`${markdownEscape(file)}\``).join('<br>')} |`);
  }

  lines.push('', 'Choose a different file lane, coordinate ownership, or wait for the reserving PR to close/merge. Do not silently overwrite parallel agent work.', '');
  return lines.join('\n');
}

async function githubJson(path, token) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': API_VERSION,
      'User-Agent': 'titans-tenx-lane-guard'
    }
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`GitHub API ${response.status} for ${path}: ${detail}`);
  }
  return response.json();
}

async function githubPages(path, token) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const separator = path.includes('?') ? '&' : '?';
    const batch = await githubJson(`${path}${separator}per_page=${PAGE_SIZE}&page=${page}`, token);
    if (!Array.isArray(batch)) throw new Error(`Expected a paginated array from ${path}`);
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
  throw new Error(`Pagination exceeded ${MAX_PAGES} pages for ${path}`);
}

async function writeSummary(text) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) await appendFile(summaryPath, text, 'utf8');
}

export async function runLaneGuard({ repository, prNumber, baseRef, token }) {
  if (!repository || !/^[-A-Za-z0-9_.]+\/[-A-Za-z0-9_.]+$/.test(repository)) throw new Error('GITHUB_REPOSITORY is missing or invalid');
  if (!Number.isInteger(prNumber) || prNumber <= 0) throw new Error('PR_NUMBER must be a positive integer');
  if (!baseRef) throw new Error('BASE_REF is required');
  if (!token) throw new Error('GITHUB_TOKEN is required');

  const currentFiles = (await githubPages(`/repos/${repository}/pulls/${prNumber}/files`, token)).map(file => file.filename).filter(Boolean);
  const openPulls = await githubPages(`/repos/${repository}/pulls?state=open&base=${encodeURIComponent(baseRef)}`, token);
  const reservations = [];

  for (const pull of openPulls) {
    if (Number(pull.number) === prNumber) continue;
    const files = (await githubPages(`/repos/${repository}/pulls/${pull.number}/files`, token)).map(file => file.filename).filter(Boolean);
    reservations.push({
      number: pull.number,
      title: pull.title,
      head: pull.head?.ref,
      draft: pull.draft,
      files
    });
  }

  const collisions = detectCollisions(currentFiles, reservations);
  const summary = collisionSummary(prNumber, collisions);
  await writeSummary(summary);

  if (collisions.length) {
    console.error(summary);
    return { ok: false, currentFiles, collisions };
  }

  console.log(summary);
  return { ok: true, currentFiles, collisions: [] };
}

async function main() {
  const result = await runLaneGuard({
    repository: process.env.GITHUB_REPOSITORY || '',
    prNumber: Number(process.env.PR_NUMBER),
    baseRef: process.env.BASE_REF || '',
    token: process.env.GITHUB_TOKEN || ''
  });
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(error => {
    console.error(`TENX lane guard failed closed: ${error?.stack || error}`);
    process.exitCode = 1;
  });
}
