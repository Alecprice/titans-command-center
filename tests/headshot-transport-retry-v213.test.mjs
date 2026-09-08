import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWithTransportRetry } from '../scripts/lib/fetch-with-transport-retry.mjs';

function transportError(code) {
  const error = new TypeError('fetch failed');
  error.cause = Object.assign(new Error(code), { code });
  return error;
}

test('retries one ECONNRESET and returns the second response', async () => {
  let calls = 0;
  const response = { ok: true, status: 200 };
  const result = await fetchWithTransportRetry('https://example.test', {}, {
    fetchImpl: async () => {
      calls += 1;
      if (calls === 1) throw transportError('ECONNRESET');
      return response;
    }
  });
  assert.equal(result, response);
  assert.equal(calls, 2);
});

test('does not retry HTTP failures', async () => {
  let calls = 0;
  const response = { ok: false, status: 500 };
  const result = await fetchWithTransportRetry('https://example.test', {}, {
    fetchImpl: async () => {
      calls += 1;
      return response;
    }
  });
  assert.equal(result, response);
  assert.equal(calls, 1);
});

test('does not retry timeout or abort failures', async () => {
  for (const name of ['TimeoutError', 'AbortError']) {
    let calls = 0;
    const error = Object.assign(new Error(name), { name });
    await assert.rejects(
      fetchWithTransportRetry('https://example.test', {}, {
        fetchImpl: async () => {
          calls += 1;
          throw error;
        }
      }),
      (caught) => caught === error
    );
    assert.equal(calls, 1);
  }
});

test('fails closed after one retry when ECONNRESET persists', async () => {
  let calls = 0;
  await assert.rejects(
    fetchWithTransportRetry('https://example.test', {}, {
      fetchImpl: async () => {
        calls += 1;
        throw transportError('ECONNRESET');
      }
    }),
    (error) => error?.cause?.code === 'ECONNRESET'
  );
  assert.equal(calls, 2);
});
