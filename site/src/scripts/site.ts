// hanusch.earth – menu on small screens, list filters, external links

// links to other sites open in a new tab
document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
  if (a.origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; }
});

const menu = document.getElementById('site-menu');
if (menu) {
  const openers = document.querySelectorAll<HTMLElement>('[data-menu-open]');
  let lastFocus: Element | null = null;
  const items = () => menu.querySelectorAll<HTMLElement>('a[href], button');
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = items();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const open = () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    document.addEventListener('keydown', onKey);
    items()[0]?.focus();
  };
  const close = () => {
    if (menu.hidden) return;
    menu.hidden = true;
    document.documentElement.style.overflow = '';
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    document.removeEventListener('keydown', onKey);
    (lastFocus as HTMLElement | null)?.focus?.();
  };
  openers.forEach((b) => b.addEventListener('click', open));
  menu.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', close));
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) close(); });
}

// Filter (components/FilterBar.astro): shows the chosen group, re-groups the
// year labels, announces the result and keeps the choice in the URL.
document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
  const key = group.dataset.filterKey!;
  const targets = document.querySelectorAll<HTMLElement>(group.dataset.filterItems!);
  const buttons = group.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const status = group.querySelector<HTMLElement>('[data-filter-status]');
  const heading = group.dataset.filterHeading ? document.querySelector<HTMLElement>(group.dataset.filterHeading) : null;
  const headingAll = heading?.textContent ?? '';
  const regroup = () => {
    document.querySelectorAll('.rows').forEach((list) => {
      let prev = '';
      list.querySelectorAll<HTMLElement>('.r').forEach((r) => {
        if (r.hidden) return;
        const y = r.querySelector('.y')?.textContent?.trim() ?? '';
        r.classList.toggle('rep', y !== '' && y === prev);
        if (y) prev = y;
      });
    });
  };
  const apply = (f: string, announce: boolean) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    let shown = 0;
    targets.forEach((t) => {
      t.hidden = !(f === 'all' || t.dataset[key] === f);
      if (!t.hidden) shown += t.matches('.r') ? 1 : t.querySelectorAll('.r, .book').length;
    });
    regroup();
    // the first section left visible sits close under the bar
    let first = true;
    targets.forEach((t) => {
      if (!t.matches('.sec')) return;
      t.classList.toggle('first-shown', !t.hidden && first);
      if (!t.hidden) first = false;
    });
    if (heading) heading.textContent = f === 'all' ? headingAll : [...buttons].find((b) => b.dataset.filter === f)?.dataset.label ?? headingAll;
    if (announce && status) status.textContent = `${shown} ${shown === 1 ? 'entry' : 'entries'} shown`;
    const url = new URL(location.href);
    if (f === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', f);
    history.replaceState(null, '', url);
  };
  // Natural top of the bar; when it is stuck, bring the start of the list
  // back under it so the result is what the visitor sees.
  const restY = () => {
    const prev = group.previousElementSibling as HTMLElement | null;
    const header = document.querySelector<HTMLElement>('.site-head')?.offsetHeight ?? 0;
    return prev ? prev.getBoundingClientRect().bottom + scrollY - header : 0;
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    const stuck = scrollY > restY();
    apply(b.dataset.filter!, true);
    if (stuck) scrollTo({ top: restY(), behavior: 'instant' as ScrollBehavior });
  }));
  group.hidden = false;
  const initial = new URL(location.href).searchParams.get('filter');
  if (initial && [...buttons].some((b) => b.dataset.filter === initial)) apply(initial, false);
});

// Audio players: one plays at a time; the file loads only on first play.
const fmt = (s: number) => {
  if (!isFinite(s)) return '–';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(sec).padStart(2, '0')}`;
};
const players = [...document.querySelectorAll<HTMLElement>('[data-player]')];
players.forEach((el) => {
  const audio = el.querySelector('audio')!;
  const btn = el.querySelector<HTMLButtonElement>('.pp')!;
  const seek = el.querySelector<HTMLInputElement>('.seek')!;
  const cur = el.querySelector('.cur')!;
  const dur = el.querySelector('.dur')!;
  const label = btn.dataset.label ?? '';
  let dragging = false;
  const paint = () => {
    const max = Number(seek.max) || 1;
    seek.style.setProperty('--p', `${(Number(seek.value) / max) * 100}%`);
    cur.textContent = fmt(Number(seek.value));
    seek.setAttribute('aria-valuetext', `${fmt(Number(seek.value))} of ${dur.textContent}`);
  };
  const err = el.querySelector<HTMLElement>('.perr')!;
  const fail = () => { el.classList.remove('is-loading', 'is-playing'); err.hidden = false; };
  btn.addEventListener('click', () => {
    if (audio.paused) {
      players.forEach((o) => { if (o !== el) o.querySelector('audio')!.pause(); });
      if (audio.readyState < 3) el.classList.add('is-loading');
      audio.play().catch((e: DOMException) => { if (e.name !== 'AbortError') fail(); });
    } else audio.pause();
  });
  audio.addEventListener('waiting', () => el.classList.add('is-loading'));
  audio.addEventListener('playing', () => el.classList.remove('is-loading'));
  audio.addEventListener('error', fail);
  audio.addEventListener('play', () => { el.classList.add('is-playing'); btn.setAttribute('aria-label', `Pause: ${label}`); });
  audio.addEventListener('pause', () => { el.classList.remove('is-playing', 'is-loading'); btn.setAttribute('aria-label', `Play: ${label}`); });
  audio.addEventListener('loadedmetadata', () => { seek.max = String(Math.floor(audio.duration)); dur.textContent = fmt(audio.duration); paint(); });
  audio.addEventListener('timeupdate', () => { if (!dragging) { seek.value = String(Math.floor(audio.currentTime)); paint(); } });
  seek.addEventListener('pointerdown', () => { dragging = true; });
  seek.addEventListener('input', paint);
  seek.addEventListener('change', () => {
    dragging = false;
    if (audio.readyState === 0) { audio.preload = 'metadata'; audio.load(); audio.addEventListener('loadedmetadata', () => { audio.currentTime = Number(seek.value); }, { once: true }); }
    else audio.currentTime = Number(seek.value);
  });
  paint();
});
