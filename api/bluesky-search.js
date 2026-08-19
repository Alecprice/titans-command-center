export default async function handler(req, res) {
  const q = String(req.query?.q || 'Tennessee Titans').slice(0, 120);
  const limit = Math.min(50, Math.max(1, Number(req.query?.limit || 20)));
  const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');
  url.searchParams.set('q', q);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sort', 'latest');
  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!upstream.ok) throw new Error(`Bluesky returned ${upstream.status}`);
    const data = await upstream.json();
    const items = (data.posts || []).map(post => {
      const text = post.record?.text || '';
      const rkey = String(post.uri || '').split('/').pop();
      const handle = post.author?.handle || post.author?.displayName || 'Bluesky user';
      return {
        id: `bsky:${post.uri}`,
        type: 'social',
        tier: 'community',
        source: `@${handle} · Bluesky`,
        title: text.length > 110 ? `${text.slice(0, 107)}…` : text || 'Bluesky post',
        summary: `${post.likeCount || 0} likes · ${post.repostCount || 0} reposts · ${post.replyCount || 0} replies`,
        publishedAt: post.record?.createdAt || post.indexedAt,
        topics: ['social','bluesky'],
        url: post.author?.handle && rkey ? `https://bsky.app/profile/${post.author.handle}/post/${rkey}` : 'https://bsky.app/'
      };
    });
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json({ ok: true, provider: 'Bluesky', query: q, items });
  } catch (error) {
    res.status(502).json({ ok: false, provider: 'Bluesky', query: q, error: 'Bluesky search unavailable', detail: String(error?.message || error) });
  }
}
