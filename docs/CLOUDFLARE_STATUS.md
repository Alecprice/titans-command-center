# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `ea9ecb1fdc7000dd6f2992eae96f15855def5012`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-26T16:15:26Z

## Quality gate failure context

```text

--- tail ---
    '\n' +
    'def assert_truthful_state(summary,label):\n' +
    "    if not summary:raise RuntimeError(f'{label}: Market Pulse did not render')\n" +
    "    if summary['overflow']:raise RuntimeError(f'{label}: horizontal overflow: {summary}')\n" +
    "    if summary['refreshHeight']<44:raise RuntimeError(f'{label}: refresh target below 44px: {summary}')\n" +
    "    if summary['errorVisible']:raise RuntimeError(f'{label}: market error panel is visible: {summary}')\n" +
    "    total=summary['total'];quality=summary['quality'];row_count=summary['rowCount']\n" +
    "    if total is None or total<0:raise RuntimeError(f'{label}: market row total missing: {summary}')\n" +
    "    if summary['shown'] is not None and summary['resultTotal'] is not None:\n" +
    "        if summary['shown']>summary['resultTotal'] or summary['resultTotal']!=total:\n" +
    "            raise RuntimeError(f'{label}: rendered result counts disagree with status total: {summary}')\n" +
    "    if quality=='Live':\n" +
    "        if total<1 or row_count<1:raise RuntimeError(f'{label}: live market mode has no rendered rows: {summary}')\n" +
    "        if summary['referenceNotice']:raise RuntimeError(f'{label}: live mode shows a published-reference warning: {summary}')\n" +
    "    elif quality=='Published reference':\n" +
    "        if total<1 or row_count<1 or 'not live odds' not in summary['referenceNotice'].lower():\n" +
    "            raise RuntimeError(f'{label}: published reference is not clearly labeled: {summary}')\n" +
    "    elif quality=='Unavailable':\n" +
    "        if total!=0 or row_count!=0 or summary['title']!='Titans market status' or not summary['empty'] or summary['referenceNotice']:\n" +
    "            raise RuntimeError(f'{label}: unavailable market state is ambiguous: {summary}')\n" +
    "    else:raise RuntimeError(f'{label}: unknown market freshness label {quality!r}: {summary}')\n" +
    "    return {'quality':quality,'provider':summary['provider'],'shown':summary['shown'],'total':total,'renderedRows':row_count}\n" +
    '\n' +
    '\n' +
    'def exercise_select(driver,selector):\n' +
    '    wait_settled(driver)\n' +
    '    stable_select_element(driver,selector)\n' +
    '    values=select_values(driver,selector)\n' +
    '    option_count=len(values)\n' +
    "    if option_count<2:return {'available':False,'options':option_count}\n" +
    '    chosen=values[1];before=read_summary(driver)\n' +
    "    if not set_select_value(driver,selector,chosen):raise RuntimeError(f'{selector}: control disappeared before selection')\n" +
    '    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value===arguments[1]",selector,chosen))\n' +
    '    wait_settled(driver);stable_select_element(driver,selector);after=read_summary(driver)\n' +
    "    if after['shown'] is not None and after['shown']<0:raise RuntimeError(f'{selector}: invalid filtered count: {after}')\n" +
    "    if after['rowCount']<1 and not after['empty']:raise RuntimeError(f'{selector}: filter rendered neither rows nor a clear empty state: {after}')\n" +
    '    stable_select_element(driver,selector)\n' +
    "    if not set_select_value(driver,selector,'all'):raise RuntimeError(f'{selector}: control disappeared before reset')\n" +
    `    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value==='all'",selector))\n` +
    '    wait_settled(driver);stable_select_element(driver,selector)\n' +
    "    return {'available':True,'options':option_count,'selectedValue':chosen,'before':before['result'],'after':after['result']}\n" +
    '\n' +
    '\n' +
    'def severe_logs(driver):\n' +
    "    return [row.get('message','') for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]\n" +
    '\n' +
    '\n' +
    "result={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}\n" +
    "started=time.time();driver=None;stage='starting'\n" +
    'try:\n' +
    "    stage='desktop:launch';driver=driver_for();driver.set_script_timeout(10)\n" +
    "    stage='desktop:load';prepare_returning_user(driver);wait_settled(driver)\n" +
    "    stage='desktop:truth';summary=read_summary(driver);state=assert_truthful_state(summary,'desktop')\n" +
    "    result['desktop']['initial']={'state':state,'summary':summary}\n" +
    '\n' +
    "    if state['total']>0:\n" +
    "        stage='desktop:filters';filters={}\n" +
    "        for key,selector in [('event','#mh-event-filter'),('book','#mh-book-filter'),('category','#mh-category-filter')]:\n" +
    '            filters[key]=exercise_select(driver,selector)\n' +
    "        result['desktop']['filters']=filters\n" +
    '\n' +
    "        stage='desktop:alternates';toggle=driver.find_elements(By.ID,'mh-alt-toggle')\n" +
    '        if toggle and toggle[0].is_enabled():\n' +
    "            before=read_summary(driver);before_rows=before['rowCount'];toggle[0].click()\n" +
    "            WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.find_element(By.ID,'mh-alt-toggle').get_attribute('aria-pressed')=='true');wait_settled(driver)"... 2590 more characters
  
      at TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/current-browser-gates.test.mjs:62:10)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1382:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:960:18)
      at Test.postRun (node:internal/test_runner/test:1522:19)
      at Test.run (node:internal/test_runner/test:1447:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:960:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: `import json\nimport os\nimport time\nfrom pathlib import Path\n\nfrom selenium import webdriver\nfrom selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException\nfrom selenium.webdriver.common.by import By\nfrom selenium.webdriver.support.ui import Select, WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\nBASE=os.environ.get('WORKER_URL','https://titans-command-center.alecjordanprice.workers.dev').rstrip('/')\nREPORT=Path('/tmp/market-browser-smoke.json')\n\n\ndef driver_for(width=1280,height=900):\n    options=webdriver.ChromeOptions()\n    options.add_argument('--headless=new')\n    options.add_argument('--no-sandbox')\n    options.add_argument('--disable-dev-shm-usage')\n    options.add_argument('--disable-gpu')\n    options.add_argument(f'--window-size={width},{height}')\n    options.set_capability('goog:loggingPrefs',{'browser':'ALL'})\n    return webdriver.Chrome(options=options)\n\n\ndef prepare_returning_user(driver):\n    driver.get(f'{BASE}/')\n    driver.execute_script("""\n      localStorage.setItem('titans:v10Onboarded','1');\n      document.querySelector('#v10-onboarding [data-v10-close]')?.click();\n    """)\n    WebDriverWait(driver,5,poll_frequency=.1).until(lambda d:not d.find_elements(By.CSS_SELECTOR,'#v10-onboarding'))\n    driver.get(f'{BASE}/#markets')\n\n\ndef wait_settled(driver,timeout=18):\n    def ready(d):\n        return d.execute_script("""\n          const app=document.querySelector('#app'),hub=document.querySelector('.market-hub');\n          if(!hub||app?.dataset.marketHub==='loading'||app?.getAttribute('aria-busy')==='true')return null;\n          const status=[...hub.querySelectorAll('.mh-status span')];\n          if(status.length<5||!hub.querySelector('#mh-refresh')||!hub.querySelector('.mh-head h2'))return null;\n          return true;\n        """)\n    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)\n\n\ndef stable_select_element(driver,selector,timeout=8):\n    state={'id':None,'stablePolls':0}\n    def ready(d):\n        try:\n            element=d.find_element(By.CSS_SELECTOR,selector)\n            if not element.is_displayed() or not element.is_enabled():return False\n            Select(element).options\n            element_id=element.id\n            if element_id==state['id']:state['stablePolls']+=1\n            else:\n                state['id']=element_id\n                state['stablePolls']=1\n            return element if state['stablePolls']>=3 else False\n        except (NoSuchElementException,StaleElementReferenceException):\n            state['id']=None;state['stablePolls']=0;return False\n    return WebDriverWait(driver,timeout,poll_frequency=.1).until(ready)\n\n\ndef select_values(driver,selector):\n    return driver.execute_script("""\n      const el=document.querySelector(arguments[0]);\n      return el?[...el.options].map(option=>option.value):[];\n    """,selector)\n\n\ndef set_select_value(driver,selector,value):\n    return driver.execute_script("""\n      const el=document.querySelector(arguments[0]);\n      if(!el||el.disabled)return false;\n      el.value=arguments[1];\n      el.dispatchEvent(new Event('change',{bubbles:true}));\n      return true;\n    """,selector,value)\n\n\ndef read_summary(driver):\n    return driver.execute_script(r"""\n      const hub=document.querySelector('.market-hub');if(!hub)return null;\n      const status=[...hub.querySelectorAll('.mh-status span')].map(x=>({text:(x.textContent||'').replace(/\\s+/g,' ').trim(),value:x.querySelector('b')?.textContent?.trim()||'',className:x.className||''}));\n      const marketStatus=status.find(x=>x.text.toLowerCase().includes('market rows'));\n      const freshness=status.find(x=>x.text.toLowerCase().includes('freshness'));\n      const result=(hub.querySelector('.mh-results')?.textContent||'').replace(/\\s+/g,' ').trim();\n      const resultNumbers=[...hub.querySelectorAll('.mh-results b')].map(x=>Number(x.textContent));\n      const rowNodes=[...hub.querySelectorAll('.mh-row')];\n      const rowCount=rowNodes.length;\n      const rowSample=rowNodes.slice(0,3).map(x=>(x.textContent||'').replace(/\\s+/g,' ').trim());\n      const controls=[...hub.querySelectorAll('.mh-controls select,.mh-controls button')].filter(x=>x.offsetParent!==null).map(x=>({id:x.id,tag:x.tagName,disabled:Boolean(x.disabled),height:x.getBoundingClientRect().height,width:x.getBoundingClientRect().width,value:x.value||'',pressed:x.getAttribute('aria-pressed')}));\n      return {\n        title:hub.querySelector('.mh-head h2')?.textContent?.trim()||'',\n        provider:status[0]?.value||'',quality:freshness?.value||'',total:Number(marketStatus?.value),\n        shown:Number.isFinite(resultNumbers[0])?resultNumbers[0]:null,resultTotal:Number.isFinite(resultNumbers[1])?resultNumbers[1]:null,\n        result,rowCount,rowSample,controls,\n        referenceNotice:(hub.querySelector('.mh-reference-notice')?.textContent||'').replace(/\\s+/g,' ').trim(),\n        empty:(hub.querySelector('.mh-empty')?.textContent||'').replace(/\\s+/g,' ').trim(),\n        refreshHeight:hub.querySelector('#mh-refresh')?.getBoundingClientRect().height||0,\n        errorVisible:Boolean(hub.querySelector('.mh-error')),\n        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+3,\n        viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth\n      };\n    """)\n\n\ndef assert_truthful_state(summary,label):\n    if not summary:raise RuntimeError(f'{label}: Market Pulse did not render')\n    if summary['overflow']:raise RuntimeError(f'{label}: horizontal overflow: {summary}')\n    if summary['refreshHeight']<44:raise RuntimeError(f'{label}: refresh target below 44px: {summary}')\n    if summary['errorVisible']:raise RuntimeError(f'{label}: market error panel is visible: {summary}')\n    total=summary['total'];quality=summary['quality'];row_count=summary['rowCount']\n    if total is None or total<0:raise RuntimeError(f'{label}: market row total missing: {summary}')\n    if summary['shown'] is not None and summary['resultTotal'] is not None:\n        if summary['shown']>summary['resultTotal'] or summary['resultTotal']!=total:\n            raise RuntimeError(f'{label}: rendered result counts disagree with status total: {summary}')\n    if quality=='Live':\n        if total<1 or row_count<1:raise RuntimeError(f'{label}: live market mode has no rendered rows: {summary}')\n        if summary['referenceNotice']:raise RuntimeError(f'{label}: live mode shows a published-reference warning: {summary}')\n    elif quality=='Published reference':\n        if total<1 or row_count<1 or 'not live odds' not in summary['referenceNotice'].lower():\n            raise RuntimeError(f'{label}: published reference is not clearly labeled: {summary}')\n    elif quality=='Unavailable':\n        if total!=0 or row_count!=0 or summary['title']!='Titans market status' or not summary['empty'] or summary['referenceNotice']:\n            raise RuntimeError(f'{label}: unavailable market state is ambiguous: {summary}')\n    else:raise RuntimeError(f'{label}: unknown market freshness label {quality!r}: {summary}')\n    return {'quality':quality,'provider':summary['provider'],'shown':summary['shown'],'total':total,'renderedRows':row_count}\n\n\ndef exercise_select(driver,selector):\n    wait_settled(driver)\n    stable_select_element(driver,selector)\n    values=select_values(driver,selector)\n    option_count=len(values)\n    if option_count<2:return {'available':False,'options':option_count}\n    chosen=values[1];before=read_summary(driver)\n    if not set_select_value(driver,selector,chosen):raise RuntimeError(f'{selector}: control disappeared before selection')\n    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value===arguments[1]",selector,chosen))\n    wait_settled(driver);stable_select_element(driver,selector);after=read_summary(driver)\n    if after['shown'] is not None and after['shown']<0:raise RuntimeError(f'{selector}: invalid filtered count: {after}')\n    if after['rowCount']<1 and not after['empty']:raise RuntimeError(f'{selector}: filter rendered neither rows nor a clear empty state: {after}')\n    stable_select_element(driver,selector)\n    if not set_select_value(driver,selector,'all'):raise RuntimeError(f'{selector}: control disappeared before reset')\n    WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.execute_script("return document.querySelector(arguments[0])?.value==='all'",selector))\n    wait_settled(driver);stable_select_element(driver,selector)\n    return {'available':True,'options':option_count,'selectedValue':chosen,'before':before['result'],'after':after['result']}\n\n\ndef severe_logs(driver):\n    return [row.get('message','') for row in driver.get_log('browser') if row.get('level')=='SEVERE' and 'favicon' not in row.get('message','').lower()]\n\n\nresult={'ok':False,'base':BASE,'desktop':{},'mobile':{},'browserWarnings':[]}\nstarted=time.time();driver=None;stage='starting'\ntry:\n    stage='desktop:launch';driver=driver_for();driver.set_script_timeout(10)\n    stage='desktop:load';prepare_returning_user(driver);wait_settled(driver)\n    stage='desktop:truth';summary=read_summary(driver);state=assert_truthful_state(summary,'desktop')\n    result['desktop']['initial']={'state':state,'summary':summary}\n\n    if state['total']>0:\n        stage='desktop:filters';filters={}\n        for key,selector in [('event','#mh-event-filter'),('book','#mh-book-filter'),('category','#mh-category-filter')]:\n            filters[key]=exercise_select(driver,selector)\n        result['desktop']['filters']=filters\n\n        stage='desktop:alternates';toggle=driver.find_elements(By.ID,'mh-alt-toggle')\n        if toggle and toggle[0].is_enabled():\n            before=read_summary(driver);before_rows=before['rowCount'];toggle[0].click()\n            WebDriverWait(driver,6,poll_frequency=.1).until(lambda d:d.find_element(By.ID,'mh-alt-toggle').get_attribute('aria-pressed')=='true');wait_settled(driver)`... 2590 more characters,
    expected: /element=stable_select_element\(driver,selector\)/,
    operator: 'match',
    diff: 'simple'
  }
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
