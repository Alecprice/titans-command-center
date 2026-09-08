const RETRYABLE_TRANSPORT_CODES = new Set(['ECONNRESET']);

export function isRetryableTransportError(error) {
  if (error?.name === 'AbortError' || error?.name === 'TimeoutError') return false;
  const code = error?.cause?.code || error?.code || '';
  return RETRYABLE_TRANSPORT_CODES.has(code);
}

export async function fetchWithTransportRetry(
  url,
  init = {},
  { fetchImpl = globalThis.fetch, attempts = 2, timeoutMs = 15000 } = {}
) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchImpl(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !isRetryableTransportError(error)) throw error;
    }
  }
  throw lastError;
}
