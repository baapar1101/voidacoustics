import fs from 'node:fs';
import path from 'node:path';

// CSS additions for RTL sliders
const RTL_SLIDER_CSS = `
/* ==========================================================================
   RTL Slider Fixes (Splide & Slick)
   ========================================================================== */

[dir="rtl"] .splide,
html[dir="rtl"] .splide {
	direction: rtl;
}

[dir="rtl"] .splide__track,
html[dir="rtl"] .splide__track {
	direction: rtl;
}

[dir="rtl"] .splide__list,
html[dir="rtl"] .splide__list {
	direction: rtl;
}

[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev,
html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev,
.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--prev,
.splide__arrows--rtl .splide__arrow--prev {
	left: auto !important;
	right: -4rem !important;
}
[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
.splide__arrows--rtl .splide__arrow--prev svg {
	--tw-rotate: 0deg !important;
	transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(0deg) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)) !important;
}

[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next,
html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next,
.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--next,
.splide__arrows--rtl .splide__arrow--next {
	right: auto !important;
	left: -4rem !important;
}
[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next svg,
html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next svg,
.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--next svg,
.splide__arrows--rtl .splide__arrow--next svg {
	--tw-rotate: 180deg !important;
	transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(180deg) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)) !important;
}

[dir="rtl"] .splide:not(.slider-outside-arrows) .splide__arrow--prev,
.splide--rtl:not(.slider-outside-arrows) .splide__arrow--prev {
	left: auto !important;
	right: 1em !important;
}
[dir="rtl"] .splide:not(.slider-outside-arrows) .splide__arrow--prev svg,
.splide--rtl:not(.slider-outside-arrows) .splide__arrow--prev svg {
	transform: rotate(0deg) !important;
}

[dir="rtl"] .splide:not(.slider-outside-arrows) .splide__arrow--next,
.splide--rtl:not(.slider-outside-arrows) .splide__arrow--next {
	right: auto !important;
	left: 1em !important;
}
[dir="rtl"] .splide:not(.slider-outside-arrows) .splide__arrow--next svg,
.splide--rtl:not(.slider-outside-arrows) .splide__arrow--next svg {
	transform: rotate(180deg) !important;
}

[dir="rtl"] .slider-progress,
html[dir="rtl"] .slider-progress {
	direction: rtl;
}
[dir="rtl"] .slider-progress .slider-progress-bar,
html[dir="rtl"] .slider-progress .slider-progress-bar {
	margin-right: 0 !important;
	margin-left: auto !important;
}

[dir="rtl"] .zoom-gallery.slick-slider .slick-arrow.slick-prev,
html[dir="rtl"] .zoom-gallery.slick-slider .slick-arrow.slick-prev {
	left: auto !important;
	right: var(--arrow-offset) !important;
}
[dir="rtl"] .zoom-gallery.slick-slider .slick-arrow.slick-next,
html[dir="rtl"] .zoom-gallery.slick-slider .slick-arrow.slick-next {
	right: auto !important;
	left: var(--arrow-offset) !important;
}
[dir="rtl"] .slick-prev svg,
html[dir="rtl"] .slick-prev svg {
	transform: rotate(180deg) !important;
}
[dir="rtl"] .slick-next svg,
html[dir="rtl"] .slick-next svg {
	transform: rotate(0deg) !important;
}

/* Complianz Cookie Banner safety overrides */
.cmplz-cookiebanner {
	max-width: 380px !important;
	box-sizing: border-box !important;
}
.cmplz-cookiebanner .cmplz-close svg,
.cmplz-close svg,
.svg-inline--fa.fa-times {
	max-width: 20px !important;
	max-height: 20px !important;
	width: 20px !important;
	height: 20px !important;
}
.cmplz-cookiebanner .cmplz-logo img,
.cmplz-cookiebanner .cmplz-logo svg {
	max-height: 35px !important;
	max-width: 140px !important;
	width: auto !important;
	height: auto !important;
}
`;

export function patchAppJs(content) {
  let res = content;

  // 1. Splide default options
  res = res.replace(
    'easing:"cubic-bezier(0.25, 1, 0.5, 1)",drag:!0,direction:"ltr",trimSpace:!0',
    'easing:"cubic-bezier(0.25, 1, 0.5, 1)",drag:!0,direction:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa")?"rtl":"ltr"),trimSpace:!0'
  );

  // 2. progressSlider
  res = res.replace(
    'i={perPage:4,gap:24,pagination:!1,arrowPath:"M1.5 58.5L28.5 29.9987L1.5 1.5"}',
    'i={perPage:4,gap:24,pagination:!1,direction:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa")?"rtl":"ltr"),arrowPath:"M1.5 58.5L28.5 29.9987L1.5 1.5"}'
  );

  // 3. textImageSlider
  res = res.replace(
    'type:"fade",drag:i>1,rewind:!0,pagination:!1});',
    'type:"fade",drag:i>1,rewind:!0,pagination:!1,direction:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa")?"rtl":"ltr")});'
  );

  // 4. Slick default options
  res = res.replace(
    'respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1',
    'respondTo:"window",responsive:null,rows:1,rtl:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa")),slide:"",slidesPerRow:1'
  );

  // 5. Dr mobile slider options
  res = res.replace(
    'adaptiveHeight:!0,arrows:!0,prevArrow:',
    'adaptiveHeight:!0,rtl:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa")),arrows:!0,prevArrow:'
  );

  // 6. js-quote-slider options
  res = res.replace(
    'e.slick({infinite:!0,speed:500,fade:!0,cssEase:"linear",adaptiveHeight:!0,arrows:!1,dots:!1,autoplay:!0})',
    'e.slick({infinite:!0,speed:500,fade:!0,cssEase:"linear",adaptiveHeight:!0,arrows:!1,dots:!1,autoplay:!0,rtl:(typeof document!=="undefined"&&(document.documentElement.dir==="rtl"||document.documentElement.lang==="fa"))})'
  );

  return res;
}

export function patchAppCss(content) {
  let res = content;
  if (!res.includes('RTL Slider Fixes')) {
    res = res + '\n' + RTL_SLIDER_CSS;
  } else if (!res.includes('Complianz Cookie Banner safety overrides')) {
    const bannerCss = `
/* Complianz Cookie Banner safety overrides */
.cmplz-cookiebanner {
	max-width: 380px !important;
	box-sizing: border-box !important;
}
.cmplz-cookiebanner .cmplz-close svg,
.cmplz-close svg,
.svg-inline--fa.fa-times {
	max-width: 20px !important;
	max-height: 20px !important;
	width: 20px !important;
	height: 20px !important;
}
.cmplz-cookiebanner .cmplz-logo img,
.cmplz-cookiebanner .cmplz-logo svg {
	max-height: 35px !important;
	max-width: 140px !important;
	width: auto !important;
	height: auto !important;
}
`;
    res = res + '\n' + bannerCss;
  }
  return res;
}

// Apply to wp-content in root, mirror, dist
const jsFiles = [
  'wp-content/themes/void2025/js/app.js',
  'mirror/wp-content/themes/void2025/js/app.js',
  'dist/wp-content/themes/void2025/js/app.js'
];

for (const f of jsFiles) {
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    const patched = patchAppJs(raw);
    if (patched !== raw) {
      fs.writeFileSync(f, patched, 'utf8');
      console.log(`Patched JS: ${f}`);
    } else {
      console.log(`JS already patched or pattern missing: ${f}`);
    }
  }
}

const cssFiles = [
  'wp-content/themes/void2025/css/app.css',
  'mirror/wp-content/themes/void2025/css/app.css',
  'dist/wp-content/themes/void2025/css/app.css'
];

for (const f of cssFiles) {
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    const patched = patchAppCss(raw);
    if (patched !== raw) {
      fs.writeFileSync(f, patched, 'utf8');
      console.log(`Patched CSS: ${f}`);
    } else {
      console.log(`CSS already patched: ${f}`);
    }
  }
}

// Also update tools/compile-fa-mirror.mjs so re-compilations include the CSS overrides in <head>
const compileFile = 'tools/compile-fa-mirror.mjs';
if (fs.existsSync(compileFile)) {
  let cHtml = fs.readFileSync(compileFile, 'utf8');
  if (!cHtml.includes('slider-outside-arrows')) {
    cHtml = cHtml.replace(
      '[dir="rtl"] .header-logo svg { max-height: 48px; width: auto; }',
      `[dir="rtl"] .header-logo svg { max-height: 48px; width: auto; }
		[dir="rtl"] .splide, html[dir="rtl"] .splide { direction: rtl; }
		[dir="rtl"] .splide__track, html[dir="rtl"] .splide__track { direction: rtl; }
		[dir="rtl"] .splide__list, html[dir="rtl"] .splide__list { direction: rtl; }
		[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev,
		html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev,
		.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--prev,
		.splide__arrows--rtl .splide__arrow--prev {
			left: auto !important;
			right: -4rem !important;
		}
		[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
		html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
		.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--prev svg,
		.splide__arrows--rtl .splide__arrow--prev svg {
			--tw-rotate: 0deg !important;
			transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(0deg) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)) !important;
		}
		[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next,
		html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next,
		.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--next,
		.splide__arrows--rtl .splide__arrow--next {
			right: auto !important;
			left: -4rem !important;
		}
		[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next svg,
		html[dir="rtl"] .slider-outside-arrows .splide__arrows .splide__arrow--next svg,
		.splide--rtl.slider-outside-arrows .splide__arrows .splide__arrow--next svg,
		.splide__arrows--rtl .splide__arrow--next svg {
			--tw-rotate: 180deg !important;
			transform: translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(180deg) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)) !important;
		}
		[dir="rtl"] .slider-progress, html[dir="rtl"] .slider-progress { direction: rtl; }
		[dir="rtl"] .slider-progress .slider-progress-bar, html[dir="rtl"] .slider-progress .slider-progress-bar {
			margin-right: 0 !important;
			margin-left: auto !important;
		}`
    );
    fs.writeFileSync(compileFile, cHtml, 'utf8');
    console.log(`Updated ${compileFile}`);
  }
}
