import runpy
from pathlib import Path

from selenium.webdriver.remote.webdriver import WebDriver

BASE_SMOKE = Path(__file__).with_name('legacy-browser-smoke-v210.py')
_original_execute_cdp_cmd = WebDriver.execute_cdp_cmd


def _execute_cdp_cmd_with_mouse_state(self, cmd, cmd_args):
    if cmd == 'Input.dispatchMouseEvent':
        args = dict(cmd_args or {})
        event_type = args.get('type')
        button = args.get('button')
        if event_type == 'mousePressed' and button == 'left':
            args.setdefault('buttons', 1)
        elif event_type in {'mouseMoved', 'mouseReleased'}:
            args.setdefault('buttons', 0)
        cmd_args = args
    return _original_execute_cdp_cmd(self, cmd, cmd_args)


WebDriver.execute_cdp_cmd = _execute_cdp_cmd_with_mouse_state
runpy.run_path(str(BASE_SMOKE), run_name='__main__')
