import runpy
from pathlib import Path

from selenium import webdriver

_REAL_CHROME=webdriver.Chrome

def _requested_viewport(options):
    for argument in getattr(options,'arguments',[]):
        if argument.startswith('--window-size='):
            width,height=argument.split('=',1)[1].split(',',1)
            return int(width),int(height)
    raise RuntimeError('Account smoke must request an explicit --window-size viewport')

def _exact_chrome(*args,**kwargs):
    options=kwargs.get('options')
    if options is None:
        for value in args:
            if hasattr(value,'arguments'):
                options=value
                break
    width,height=_requested_viewport(options)
    driver=_REAL_CHROME(*args,**kwargs)
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{
        'width':width,
        'height':height,
        'deviceScaleFactor':1,
        'mobile':False,
    })
    actual=driver.execute_script('return [innerWidth,innerHeight]')
    if actual[0]!=width or actual[1]!=height:
        driver.quit()
        raise RuntimeError(f'Account viewport mismatch: requested={width}x{height} actual={actual}')
    return driver

webdriver.Chrome=_exact_chrome
runpy.run_path(str(Path(__file__).with_name('account-browser-smoke-core.py')),run_name='__main__')
