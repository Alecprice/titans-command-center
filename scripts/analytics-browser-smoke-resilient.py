import json
import os
import subprocess
import sys
import time
from pathlib import Path

REPORT = Path('/tmp/analytics-browser-smoke.json')
STRICT_SMOKE = Path(__file__).with_name('analytics-browser-smoke.py')
MAX_ATTEMPTS = 2
ROUTE_LOAD_STAGES = {'desktop:load-stats', 'mobile:resize', 'mobile:degraded-analytics'}
RENDERER_TIMEOUT_MARKER = 'timed out receiving message from renderer'


def load_report():
    try:
        payload = json.loads(REPORT.read_text(encoding='utf-8'))
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def retryable_renderer_load_timeout(report):
    if report.get('ok') is not False:
        return False
    if report.get('stage') not in ROUTE_LOAD_STAGES:
        return False
    error = str(report.get('error') or '')
    lowered = error.lower()
    return lowered.startswith('timeoutexception:') and RENDERER_TIMEOUT_MARKER in lowered


def run_strict_smoke():
    return subprocess.run([sys.executable, str(STRICT_SMOKE)], env=os.environ.copy(), check=False)


def main():
    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = run_strict_smoke()
        if result.returncode == 0:
            if attempt > 1:
                print(
                    f'Advanced analytics browser smoke recovered after {attempt - 1} bounded renderer retry.',
                    file=sys.stderr,
                )
            return 0

        report = load_report()
        can_retry = attempt < MAX_ATTEMPTS and retryable_renderer_load_timeout(report)
        if can_retry:
            print(
                f"Advanced analytics route load hit a Chrome renderer timeout at {report.get('stage')}; "
                'retrying the unchanged strict smoke once.',
                file=sys.stderr,
            )
            time.sleep(0.75)
            continue

        return result.returncode or 1

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
