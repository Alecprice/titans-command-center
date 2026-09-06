import json
import os
import subprocess
import sys
import time
from pathlib import Path

REPORT = Path('/tmp/analytics-browser-smoke.json')
MOBILE_REPORT = Path('/tmp/analytics-mobile-browser-smoke-v202.json')
STRICT_SMOKE = Path(__file__).with_name('analytics-browser-smoke.py')
MOBILE_SMOKE = Path(__file__).with_name('analytics-mobile-browser-smoke-v202.py')
MAX_ATTEMPTS = 2
ROUTE_LOAD_STAGES = {'desktop:load-stats', 'mobile:resize', 'mobile:degraded-analytics'}
RENDERER_TIMEOUT_MARKER = 'timed out receiving message from renderer'


def load_json(path):
    try:
        payload = json.loads(path.read_text(encoding='utf-8'))
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def load_report():
    return load_json(REPORT)


def retain_mobile_evidence(mobile_report):
    strict_report = load_report()
    if not strict_report:
        return
    strict_report['deterministicMobile'] = mobile_report
    REPORT.write_text(json.dumps(strict_report, indent=2), encoding='utf-8')


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


def run_mobile_smoke():
    return subprocess.run([sys.executable, str(MOBILE_SMOKE)], env=os.environ.copy(), check=False)


def main():
    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = run_strict_smoke()
        if result.returncode == 0:
            if attempt > 1:
                print(
                    f'Advanced analytics browser smoke recovered after {attempt - 1} bounded renderer retry.',
                    file=sys.stderr,
                )
            try:
                MOBILE_REPORT.unlink()
            except FileNotFoundError:
                pass
            mobile = run_mobile_smoke()
            mobile_report = load_json(MOBILE_REPORT)
            retain_mobile_evidence(mobile_report)
            if mobile.returncode != 0:
                detail = mobile_report.get('error') or 'mobile report unavailable'
                stage = mobile_report.get('stage') or 'unknown'
                print(
                    f'Deterministic Advanced Analytics mobile smoke failed at {stage}: {detail}',
                    file=sys.stderr,
                )
                return mobile.returncode or 1
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
