(() => {
  'use strict';

  const languageIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4M12 3.5c2.15 2.3 3.25 5.13 3.25 8.5S14.15 18.2 12 20.5M12 3.5C9.85 5.8 8.75 8.63 8.75 12s1.1 6.2 3.25 8.5"/></svg>';
  const chevronIcon = '<svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.25 5 5 5-5"/></svg>';

  const enhanceLanguageSwitcher = () => {
    const switcher = document.querySelector('.site-header .country-selector');
    if (!switcher || switcher.dataset.voidLanguageReady === 'true') return;

    const input = switcher.querySelector('.weglot_choice');
    const label = switcher.querySelector('label');
    const menu = switcher.querySelector('ul');
    const option = menu?.querySelector('a');
    if (!input || !label || !menu || !option) return;

    const isFa = document.documentElement.dir === 'rtl' || /^fa\b/i.test(document.documentElement.lang || '');
    const current = isFa
      ? { code: 'FA', name: 'فارسی' }
      : { code: 'EN', name: 'English' };
    const target = isFa
      ? { code: 'EN', name: 'English', note: 'نمایش سایت به انگلیسی' }
      : { code: 'FA', name: 'فارسی', note: 'View site in Persian' };

    switcher.dataset.voidLanguageReady = 'true';
    switcher.classList.add('void-language-switch');
    switcher.setAttribute('aria-label', isFa ? 'انتخاب زبان سایت' : 'Choose site language');
    switcher.setAttribute('aria-expanded', 'false');

    const menuId = `${input.id || 'void-language'}-menu`;
    menu.id = menuId;
    menu.setAttribute('role', 'menu');
    menu.querySelectorAll('li').forEach((item) => item.setAttribute('role', 'none'));

    label.tabIndex = 0;
    label.setAttribute('role', 'button');
    label.setAttribute('aria-haspopup', 'menu');
    label.setAttribute('aria-controls', menuId);
    label.setAttribute('aria-expanded', 'false');
    label.setAttribute('aria-label', isFa ? 'زبان فعلی فارسی؛ تغییر زبان' : 'Current language English; change language');
    label.innerHTML = `
      <span class="void-language-switch__icon">${languageIcon}</span>
      <span class="void-language-switch__current">
        <span class="void-language-switch__name">${current.name}</span>
        <span class="void-language-switch__code">${current.code}</span>
      </span>
      <span class="void-language-switch__chevron">${chevronIcon}</span>`;

    option.setAttribute('role', 'menuitem');
    option.setAttribute('aria-label', target.note);
    option.innerHTML = `
      <span class="void-language-switch__option-icon">${languageIcon}</span>
      <span class="void-language-switch__option-copy">
        <strong>${target.name}</strong>
        <small>${target.note}</small>
      </span>
      <span class="void-language-switch__option-code">${target.code}</span>`;

    const sync = () => {
      const open = input.checked;
      switcher.classList.toggle('is-open', open);
      switcher.classList.toggle('closed', !open);
      switcher.classList.toggle('open', open);
      switcher.setAttribute('aria-expanded', String(open));
      label.setAttribute('aria-expanded', String(open));
    };

    input.addEventListener('change', sync);
    label.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      input.click();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!input.checked || switcher.contains(event.target)) return;
      input.checked = false;
      sync();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !input.checked) return;
      input.checked = false;
      sync();
      label.focus();
    });
    sync();
  };

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M9 21v-7h6v7"/></svg>',
    products: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>',
    discover: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z"/></svg>',
    insights: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9m7 10V5m7 14v-7"/><path d="M3 21h18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>'
  };

  const init = () => {
    enhanceLanguageSwitcher();
    if (document.querySelector('.void-mobile-dock')) return;

    const html = document.documentElement;
    const isFa = html.dir === 'rtl' || /^fa\b/i.test(html.lang || '');
    const isEnglishPath = /^\/en(?:\/|$)/i.test(location.pathname);
    const prefix = isEnglishPath ? '/en' : '';
    const route = (pathname) => `${prefix}${pathname}`;
    const currentPath = location.pathname.replace(/^\/en(?=\/|$)/i, '') || '/';

    html.classList.add('void-enhanced');
    document.body.dataset.voidMobileApp = 'ready';

    /* Keep the app sheet outside the glass header's containing block. */
    const mobileMedia = matchMedia('(max-width: 959px)');
    const menuPanel = document.getElementById('primary-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const portalItems = [menuPanel, menuOverlay].filter(Boolean).map((element) => ({
      element,
      parent: element.parentNode,
      next: element.nextSibling
    }));
    const syncMenuPortal = () => {
      for (const item of portalItems) {
        if (mobileMedia.matches) {
          document.body.appendChild(item.element);
        } else if (item.parent && item.element.parentNode !== item.parent) {
          item.parent.insertBefore(item.element, item.next && item.next.parentNode === item.parent ? item.next : null);
        }
      }
    };
    syncMenuPortal();
    if (mobileMedia.addEventListener) mobileMedia.addEventListener('change', syncMenuPortal);
    else mobileMedia.addListener(syncMenuPortal);

    const labels = isFa
      ? { home: 'خانه', products: 'محصولات', discover: 'فضاها', insights: 'پروژه‌ها', menu: 'منو', menuAria: 'باز کردن منوی اصلی' }
      : { home: 'Home', products: 'Products', discover: 'Discover', insights: 'Stories', menu: 'Menu', menuAria: 'Open main menu' };

    const items = [
      { key: 'home', href: route('/'), active: currentPath === '/' },
      { key: 'products', href: route('/products/'), active: currentPath.startsWith('/products/') },
      { key: 'discover', href: route('/discover/'), active: currentPath.startsWith('/discover/') },
      { key: 'insights', href: route('/insights/'), active: currentPath.startsWith('/insights/') }
    ];

    const dock = document.createElement('nav');
    dock.className = 'void-mobile-dock';
    dock.setAttribute('aria-label', isFa ? 'ناوبری سریع' : 'Quick navigation');

    for (const item of items) {
      const link = document.createElement('a');
      link.className = `void-mobile-dock__item${item.active ? ' is-active' : ''}`;
      link.href = item.href;
      link.setAttribute('aria-label', labels[item.key]);
      if (item.active) link.setAttribute('aria-current', 'page');
      link.innerHTML = `${icons[item.key]}<span>${labels[item.key]}</span>`;
      dock.appendChild(link);
    }

    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'void-mobile-dock__item void-mobile-dock__menu';
    menu.setAttribute('aria-label', labels.menuAria);
    menu.setAttribute('aria-expanded', 'false');
    menu.innerHTML = `${icons.menu}<span>${labels.menu}</span>`;
    menu.addEventListener('click', () => {
      const toggle = document.getElementById('primary-menu-toggle');
      if (toggle) toggle.click();
    });
    dock.appendChild(menu);
    document.body.appendChild(dock);

    const progress = document.createElement('div');
    progress.className = 'void-scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const header = document.querySelector('.site-header');
    let ticking = false;
    const updateScrollUI = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      progress.style.transform = `scaleX(${ratio})`;
      if (header) header.classList.toggle('void-header-scrolled', window.scrollY > 24);
      ticking = false;
    };
    const requestScrollUI = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateScrollUI);
    };
    addEventListener('scroll', requestScrollUI, { passive: true });
    addEventListener('resize', requestScrollUI, { passive: true });
    updateScrollUI();

    const syncMenu = () => {
      const open = document.body.classList.contains('side-menu-open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open
        ? (isFa ? 'بستن منوی اصلی' : 'Close main menu')
        : labels.menuAria);
    };
    new MutationObserver(syncMenu).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    syncMenu();

    if (matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
      document.body.classList.add('void-standalone');
    }

    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const candidates = [
        ...document.querySelectorAll('main > section:not(:first-child), main .grid > a, main .splide__slide > a')
      ];
      const revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }, { rootMargin: '0px 0px 80px', threshold: .04 });
      for (const element of candidates.slice(0, 160)) {
        element.classList.add('void-reveal');
        revealObserver.observe(element);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
