import json
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

BASE = os.environ.get('WORKER_URL', 'https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')
REPORT = Path('/tmp/player-gameday-browser-smoke.json')
STRICT_SMOKE = Path(__file__).with_name('player-gameday-browser-smoke.py')
MAX_ATTEMPTS = 2
MIN_TRANSIENT_ASSET_FAILURES = 5
TRANSIENT_NETWORK_MARKERS = ('net::ERR_FAILED', 'net::ERR_CERT_VERIFIER_CHANGED')
STARTUP_STAGES = {'player:find', 'roster:stability'}


def load_report():
    try:
        payload = json.loads(REPORT.read_text(encoding='utf-8'))
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def transient_asset_failures(report):
    host = urlparse(BASE).netloc.lower()
    warnings = report.get('browserWarnings') if isinstance(report.get('browserWarnings'), list) else []
    hits = []
    for warning in warnings:
        if not isinstance(warning, dict) or warning.get('level') != 'SEVERE':
            continue
        message = str(warning.get('message') or '')
        lowered = message.lower()
        if host and host not in lowered:
            continue
        if not any(marker.lower() in lowered for marker in TRANSIENT_NETWORK_MARKERS):
            continue
        hits.append(warning)
    return hits


def retryable_startup_failure(report):
    if report.get('ok') is not False:
        return False
    if report.get('stage') not in STARTUP_STAGES:
        return False
    if str(report.get('pageText') or '').strip():
        return False
    return len(transient_asset_failures(report)) >= MIN_TRANSIENT_ASSET_FAILURES


def run_strict_smoke():
    return subprocess.run([sys.executable, str(STRICT_SMOKE)], env=os.environ.copy(), check=False)


def main():
    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = run_strict_smoke()
        if result.returncode == 0:
            if attempt > 1:
                print(f'Player/Game Day browser smoke recovered after {attempt - 1} bounded transient retry.', file=sys.stderr)
            return 0

        report = load_report()
        failures = transient_asset_failures(report)
        can_retry = attempt < MAX_ATTEMPTS and retryable_startup_failure(report)
        if can_retry:
            print(
                f'Player/Game Day startup saw {len(failures)} broad same-origin asset failures; '
                'retrying the unchanged strict smoke once.',
                file=sys.stderr,
            )
            time.sleep(0.75)
            continue

        return result.returncode or 1

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
