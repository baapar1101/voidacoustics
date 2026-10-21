(() => {
  'use strict';

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M9 21v-7h6v7"/></svg>',
    products: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>',
    discover: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z"/></svg>',
    insights: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9m7 10V5m7 14v-7"/><path d="M3 21h18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>'
  };

  const init = () => {
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
