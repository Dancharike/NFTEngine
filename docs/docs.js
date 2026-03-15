const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target))
      sidebar.classList.remove('open');
  });
}

/* ── Active sidebar link ── */
(function markActive() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.sidebar-section a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (path.endsWith(href)) a.classList.add('active');
  });
})();

/* ── Lazy loading fallback (for browsers without native support) ── */
if ('loading' in HTMLImageElement.prototype === false) {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.src = e.target.dataset.src; io.unobserve(e.target); }
    });
  });
  imgs.forEach(img => { img.dataset.src = img.src; img.src = ''; io.observe(img); });
}

/* ── Simple client-side search ── */
const searchInput = document.querySelector('.header-search input');
if (searchInput) {
  const index = [
    { title: 'Getting Started',         url: 'getting-started.html',        keywords: 'install setup tutorial first game' },
    { title: 'GameObject API',          url: 'api/gameobject.html',         keywords: 'gameobject mesh active visible update destroy' },
    { title: 'GameScene API',           url: 'api/gamescene.html',          keywords: 'gamescene addGameObject removeGameObject load update' },
    { title: 'Component System',        url: 'api/component.html',          keywords: 'component update message attach' },
    { title: 'Home',                    url: '../index.html',               keywords: 'beresta engine lite overview' },
  ];

  const dropdown = document.createElement('ul');
  dropdown.className = 'search-dropdown';
  dropdown.style.cssText = `
    position:absolute;top:100%;left:0;right:0;background:var(--bg2);
    border:1px solid var(--border);border-radius:8px;list-style:none;
    margin-top:4px;display:none;z-index:200;overflow:hidden;`;
  searchInput.parentElement.appendChild(dropdown);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (!q) { dropdown.style.display = 'none'; return; }

    const results = index.filter(item =>
      item.title.toLowerCase().includes(q) || item.keywords.includes(q)
    );

    if (!results.length) { dropdown.style.display = 'none'; return; }

    results.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${r.url}" style="display:block;padding:.5rem 1rem;font-size:.875rem;color:var(--text2)">${r.title}</a>`;
      li.querySelector('a').addEventListener('mouseenter', e => e.target.style.color = 'var(--text)');
      li.querySelector('a').addEventListener('mouseleave', e => e.target.style.color = 'var(--text2)');
      dropdown.appendChild(li);
    });

    dropdown.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!searchInput.parentElement.contains(e.target)) dropdown.style.display = 'none';
  });
}

/* ── Broken link checker (dev only, localhost) ── */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    document.querySelectorAll('a[href]').forEach(async a => {
      const href = a.getAttribute('href');
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
      try {
        const res = await fetch(href, { method: 'HEAD' });
        if (!res.ok) {
          a.style.outline = '2px solid red';
          a.title = `Broken link: ${res.status}`;
          console.warn('[BrokenLink]', href, res.status);
        }
      } catch { /* cross-origin or file:// — skip */ }
    });
  });
}
