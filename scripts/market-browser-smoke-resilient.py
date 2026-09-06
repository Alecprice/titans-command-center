import json
import os
import subprocess
import sys
import time
from pathlib import Path

REPORT = Path('/tmp/market-browser-smoke.json')
STRICT_SMOKE = Path(__file__).with_name('market-browser-smoke.py')
MAX_ATTEMPTS = 2
RETRYABLE_STAGE = 'desktop:load'
TIMEOUT_PREFIX = 'timeoutexception:'


def load_report():
    try:
        payload = json.loads(REPORT.read_text(encoding='utf-8'))
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def retryable_route_load_timeout(report):
    if report.get('ok') is not False:
        return False
    if report.get('stage') != RETRYABLE_STAGE:
        return False
    if report.get('desktop') not in ({}, None):
        return False
    if report.get('mobile') not in ({}, None):
        return False
    if report.get('state') is not None:
        return False
    if report.get('browserWarnings') not in ([], None):
        return False
    error = str(report.get('error') or '').strip().lower()
    return error.startswith(TIMEOUT_PREFIX)


def run_strict_smoke():
    return subprocess.run([sys.executable, str(STRICT_SMOKE)], env=os.environ.copy(), check=False)


def main():
    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = run_strict_smoke()
        if result.returncode == 0:
            if attempt > 1:
                print('Market Pulse browser smoke recovered after one bounded desktop route-load retry.', file=sys.stderr)
            return 0

        report = load_report()
        can_retry = attempt < MAX_ATTEMPTS and retryable_route_load_timeout(report)
        if can_retry:
            print(
                'Market Pulse desktop route load timed out before any market state or browser warning was captured; '
                'retrying the unchanged strict smoke once.',
                file=sys.stderr,
            )
            time.sleep(0.75)
            continue

        return result.returncode or 1

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
