#!/usr/bin/env python3
"""Edit the content of hanusch.earth in Baserow and publish it.

Python standard library only. The Baserow token is stored on this computer
(see TOKEN_FILE), never in the skill or the repository.

  baserow.py setup                 store the token (read from stdin or a hidden prompt) and test it
  baserow.py check                 test the stored token
  baserow.py tables                tables and fields, with the help texts from Baserow
  baserow.py rows TABLE [TEXT]     rows as JSON (optionally only rows containing TEXT)
  baserow.py get TABLE ROW_ID      one row
  baserow.py create TABLE JSON|-   new row (fields by name), printed back; --before ROW_ID to place it
  baserow.py update TABLE ROW_ID JSON|-   change only the given fields
  baserow.py delete TABLE ROW_ID   delete a row (Baserow keeps it in its trash for a while)
  baserow.py move TABLE ROW_ID [--before ROW_ID]   change the row order (no --before = to the end)
  baserow.py upload FILE           upload an image; prints the value for a file field
  baserow.py publish [--wait] [--check PATH TEXT]
                                   press "Publish now" (rebuilds the website); --wait stays until the
                                   build has finished, --check also waits until TEXT is live on PATH
  baserow.py status                state of the latest website builds on GitHub
  baserow.py live PATH TEXT        is TEXT on the live page PATH (e.g. /publications/)?
"""
import calendar
import getpass
import json
import mimetypes
import os
import stat
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

BASEROW = 'https://api.baserow.io'
DATABASE_ID = 597662  # workspace "Hanusch.Earth", database "Webseite"
REPO = 'hanusch-earth/hanusch-earth.github.io'
SITE = 'https://hanusch-earth.github.io'  # change to https://www.hanusch.earth once the domain points to GitHub Pages
TOKEN_FILE = Path.home() / '.config' / 'hanusch-website' / 'baserow-token'


def die(msg):
    sys.exit(f'error: {msg}')


def token():
    t = os.environ.get('HANUSCH_BASEROW_TOKEN') or (TOKEN_FILE.read_text().strip() if TOKEN_FILE.exists() else '')
    if not t:
        die('no Baserow token stored yet; run: baserow.py setup')
    return t


def http(method, url, body=None, headers=None, raw=None):
    h = dict(headers or {})
    data = raw
    if body is not None:
        data = json.dumps(body).encode()
        h['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            text = r.read().decode()
            return json.loads(text) if 'json' in r.headers.get('Content-Type', '') and text else text
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:600]
        if e.code == 401:
            die(f'Baserow rejected the token (401). Create a new one and run setup again. {detail}')
        die(f'{method} {url} -> {e.code}: {detail}')


def api(method, path, body=None, raw=None, headers=None):
    return http(method, BASEROW + path, body, {'Authorization': f'Token {token()}', **(headers or {})}, raw)


def tables():
    return api('GET', '/api/database/tables/all-tables/')


def table_id(name):
    for t in tables():
        if t['name'].lower() == name.lower():
            return t['id']
    die(f'no table "{name}"; tables: ' + ', '.join(t['name'] for t in tables()))


def all_rows(tid):
    out, page = [], 1
    while True:
        r = api('GET', f'/api/database/rows/table/{tid}/?user_field_names=true&size=200&page={page}')
        out += r['results']
        if not r['next']:
            return out
        page += 1


def payload(arg):
    text = sys.stdin.read() if arg == '-' else arg
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        die(f'not valid JSON: {e}')


def show(x):
    print(json.dumps(x, indent=2, ensure_ascii=False))


def option(args, name):
    if name in args:
        i = args.index(name)
        value = args[i + 1]
        del args[i:i + 2]
        return value
    return None


def cmd_setup(args):
    t = sys.stdin.readline().strip() if not sys.stdin.isatty() else getpass.getpass('Baserow database token: ').strip()
    if not t:
        die('empty token')
    os.environ['HANUSCH_BASEROW_TOKEN'] = t
    cmd_check([])
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.parent.chmod(stat.S_IRWXU)
    TOKEN_FILE.write_text(t + '\n')
    TOKEN_FILE.chmod(stat.S_IRUSR | stat.S_IWUSR)
    print(f'stored in {TOKEN_FILE} (readable only by you)')


def cmd_check(args):
    names = [t['name'] for t in tables() if t['database_id'] == DATABASE_ID]
    if not names:
        die('the token works but does not reach the database "Webseite"; choose the workspace "Hanusch.Earth" when creating it')
    print('token ok; tables:', ', '.join(names))


def cmd_tables(args):
    for t in tables():
        if t['database_id'] != DATABASE_ID:
            continue
        print(f"\n{t['name']}")
        for f in api('GET', f"/api/database/fields/table/{t['id']}/"):
            kind = f['type']
            if kind == 'single_select':
                kind += ' [' + ' | '.join(o['value'] for o in f['select_options']) + ']'
            note = f" - {f['description']}" if f.get('description') else ''
            print(f"  {f['name']} ({kind}){note}")


def cmd_rows(args):
    rows = all_rows(table_id(args[0]))
    if len(args) > 1:  # filtered here: Baserow's own search misses rows added a moment ago
        rows = [r for r in rows if args[1].lower() in json.dumps(r, ensure_ascii=False).lower()]
    show(rows)


def cmd_get(args):
    show(api('GET', f'/api/database/rows/table/{table_id(args[0])}/{int(args[1])}/?user_field_names=true'))


def cmd_create(args):
    before = option(args, '--before')
    q = f'&before={int(before)}' if before else ''
    show(api('POST', f'/api/database/rows/table/{table_id(args[0])}/?user_field_names=true{q}', payload(args[1])))


def cmd_update(args):
    show(api('PATCH', f'/api/database/rows/table/{table_id(args[0])}/{int(args[1])}/?user_field_names=true', payload(args[2])))


def cmd_delete(args):
    api('DELETE', f'/api/database/rows/table/{table_id(args[0])}/{int(args[1])}/')
    print('deleted')


def cmd_move(args):
    before = option(args, '--before')
    q = f'?before_id={int(before)}' if before else ''
    r = api('PATCH', f'/api/database/rows/table/{table_id(args[0])}/{int(args[1])}/move/{q}')
    print('moved, new order', r['order'])


def cmd_upload(args):
    path = Path(args[0]).expanduser()
    if not path.is_file():
        die(f'no file {path}')
    boundary = uuid.uuid4().hex
    kind = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    body = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{path.name}"\r\n'
            f'Content-Type: {kind}\r\n\r\n').encode() + path.read_bytes() + f'\r\n--{boundary}--\r\n'.encode()
    f = api('POST', '/api/user-files/upload-file/', raw=body, headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})
    # value for a file field; visible_name becomes the file name on the website
    show([{'name': f['name'], 'visible_name': path.name}])


def runs():
    return http('GET', f'https://api.github.com/repos/{REPO}/actions/runs?per_page=5',
                headers={'Accept': 'application/vnd.github+json'})['workflow_runs']


def on_page(path, text):
    return text in http('GET', SITE + path + ('&' if '?' in path else '?') + f'nocache={uuid.uuid4().hex}')


def cmd_publish(args):
    check = None
    if '--check' in args:
        i = args.index('--check')
        check = args[i + 1:i + 3]
    wait = '--wait' in args or check
    rows = all_rows(table_id('Publish'))
    url = rows and (rows[0].get('Publish') or {}).get('url')
    if not url:
        die('no "Publish now" button found in the table Publish')
    started = time.time() - 30  # tolerance for clock differences
    print(http('GET', url) or 'publishing started', flush=True)
    if not wait:
        return

    # 1. wait for the build started by the button (about 2 minutes, longer when GitHub is busy)
    run, deadline = None, time.time() + 20 * 60
    while time.time() < deadline:
        time.sleep(20)
        mine = [r for r in runs() if r['event'] == 'repository_dispatch'
                and calendar.timegm(time.strptime(r['created_at'], '%Y-%m-%dT%H:%M:%SZ')) >= started]
        if mine:
            run = mine[0]
            print(f"build {run['status']}", flush=True)
            if run['status'] == 'completed':
                break
    if not run or run['status'] != 'completed':
        die('the build has not finished after 20 minutes; check ' + (run['html_url'] if run else f'https://github.com/{REPO}/actions'))
    if run['conclusion'] != 'success':
        die(f"the build ended with \"{run['conclusion']}\"; the website still shows the previous version. Details: {run['html_url']}")
    print('build finished, website deployed', flush=True)

    # 2. optionally wait until the change is visible (GitHub Pages caches pages for up to 10 minutes)
    if check:
        deadline = time.time() + 12 * 60
        while time.time() < deadline:
            if on_page(*check):
                print(f'LIVE: "{check[1]}" is on {SITE}{check[0]}')
                return
            time.sleep(30)
        die(f'build succeeded, but "{check[1]}" is not on {SITE}{check[0]} after 12 minutes; check whether the entry is complete (warnings in {run["html_url"]})')
    print(f'LIVE: {SITE}')


def cmd_status(args):
    for r in runs()[:3]:
        print(f"{r['created_at']}  {r['event']:<20} {r['status']:<12} {r['conclusion'] or ''}  {r['html_url']}")


def cmd_live(args):
    path, text = args[0], args[1]
    found = on_page(path, text)
    print(('found' if found else 'NOT found') + f' on {SITE}{path}')
    sys.exit(0 if found else 1)


COMMANDS = {k[4:]: v for k, v in globals().items() if k.startswith('cmd_')}

if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print(__doc__)
        sys.exit(1)
    COMMANDS[sys.argv[1]](sys.argv[2:])
