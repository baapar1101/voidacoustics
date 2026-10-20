import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const EN_DIR = path.join(process.cwd(), 'mirror', 'en');
const ROOT_MIRROR = path.join(process.cwd(), 'mirror');

// Load full glossary
const glossary = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));

// Sort dictionary keys by length descending to match longest phrases first if needed
const sortedGlossaryKeys = Object.keys(glossary).sort((a, b) => b.length - a.length);

// Inline Persian Logo SVG for header (fill="currentColor" to adapt to header themes)
const FA_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="56" viewBox="0 0 900 360" fill="none" class="header-fa-logo">
  <path fill="currentColor" d="m 557.57189,302.12 q -16.184,0 -28.084,-2.618 -11.662,-2.38 -22.61,-8.806 l 13.804,-25.942 q 9.758,4.998 18.326,6.902 8.568,2.142 17.85,2.142 13.566,0 20.706,-7.378 7.378,-7.378 7.378,-20.23 V 245 h -23.562 q -25.466,0 -39.27,-14.28 -13.566,-14.518 -13.566,-41.174 0,-20.23 9.758,-34.034 9.996,-14.042 27.132,-21.182 17.136,-7.14 38.794,-7.14 h 36.176 v 118.524 q 0,27.132 -16.422,41.65 -16.422,14.756 -46.41,14.756 z m 27.37,-85.68 v -60.69 h -7.616 q -15.232,0 -23.8,8.568 -8.568,8.568 -8.568,24.276 0,27.846 23.562,27.846 z M 404.06605,245 q -1.19,0 -1.19,-1.19 v -26.418 q 0,-0.952 1.19,-0.952 h 41.65 v -89.25 h 35.462 V 245 Z m 19.278,59.5 q -7.378,0 -11.662,-4.76 -4.284,-4.522 -4.284,-12.376 0,-7.854 4.284,-12.614 4.284,-4.522 11.662,-4.522 7.378,0 11.424,4.522 4.284,4.522 4.284,12.614 0,8.092 -4.284,12.614 -4.284,4.522 -11.424,4.522 z m 40.46,0 q -7.378,0 -11.662,-4.76 -4.284,-4.522 -4.284,-12.376 0,-7.854 4.284,-12.614 4.284,-4.522 11.662,-4.522 7.378,0 11.424,4.522 4.284,4.76 4.284,12.614 0,7.854 -4.284,12.376 -4.284,4.76 -11.424,4.76 z M 270.07591,216.44 h 79.492 q -4.998,-21.896 -11.9,-35.462 -7.14,-13.566 -18.088,-23.324 -10.71,-9.996 -26.418,-16.422 l 13.328,-33.32 q 31.416,12.614 50.456,38.794 19.278,26.18 28.322,69.734 h 31.178 q 1.19,0 1.19,0.952 v 26.418 q 0,1.19 -1.19,1.19 h -146.37 z" style="font-weight:700;font-size:238px;direction:rtl;text-anchor:middle;fill:currentColor" aria-label="وید"/>
</svg>`;

// Head injections for Persian
const FA_HEAD_INJECTION = `
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
	<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192">
	<link rel="apple-touch-icon" href="/favicon.png">
	<style id="fa-rtl-override">
		:root, body, button, input, select, textarea, .font-sans, .font-heading {
			font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
		}
		.tracking-widest, .tracking-wider, .tracking-wide, .tracking-tight, .tracking-tighter, [class*="tracking-"] {
			letter-spacing: 0 !important;
		}
		[dir="rtl"] .text-left { text-align: right; }
		[dir="rtl"] .text-right { text-align: left; }
		[dir="rtl"] .mr-auto { margin-right: 0; margin-left: auto; }
		[dir="rtl"] .header-logo svg {
			display: inline-block;
			height: 37px;
			width: auto;
			vertical-align: middle;
		}
		@media (min-width: 960px) {
			[dir="rtl"] .header-logo svg {
				height: 3.5rem;
				width: auto;
			}
		}
		.site-footer .header-logo svg {
			height: 2.25rem !important;
			width: auto !important;
		}
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
	</style>
`;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function translateText(text) {
  if (!text) return text;
  const trimmed = text.trim();
  if (glossary[trimmed]) {
    return text.replace(trimmed, glossary[trimmed]);
  }
  // Try case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const k of sortedGlossaryKeys) {
    if (k.toLowerCase() === lower) {
      return text.replace(trimmed, glossary[k]);
    }
  }
  return text;
}

function translateAttr(attrName, val) {
  if (!val) return val;
  const trimmed = val.trim();
  if (glossary[trimmed]) return glossary[trimmed];
  return translateText(val);
}

function walkFiles(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, acc);
    else if (ent.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

export async function compileAll() {
  const files = walkFiles(EN_DIR);
  console.log(`Starting compilation for ${files.length} pages...`);

  let faCount = 0;
  let enUpdated = 0;

  for (const file of files) {
    const rel = path.relative(EN_DIR, file).replace(/\\/g, '/');
    const slug = rel.replace(/(^|\/)index\.html$/i, '$1').replace(/\.html$/i, '');
    const cleanSlug = slug === 'index' ? '' : slug;

    const faPath = cleanSlug === '' ? '/' : `/${cleanSlug}/`;
    const enPath = cleanSlug === '' ? '/en/' : `/en/${cleanSlug}/`;
    const faUrl = `https://voidacoustics.com${faPath}`;
    const enUrl = `https://voidacoustics.com${enPath}`;

    const originalHtml = fs.readFileSync(file, 'utf8');

    // ==========================================
    // 1. GENERATE PERSIAN PAGE (mirror/<slug>/index.html)
    // ==========================================
    const doc = parse5.parse(originalHtml, { sourceCodeLocationInfo: true });
    const replacements = [];

    function addRepl(startOffset, endOffset, replacement) {
      if (typeof startOffset === 'number' && typeof endOffset === 'number' && startOffset <= endOffset) {
        if (!replacements.some(r => r.startOffset === startOffset && r.endOffset === endOffset)) {
          replacements.push({ startOffset, endOffset, replacement });
        }
      }
    }

    function traverse(node) {
      // 1. <html> tag
      if (node.nodeName === 'html' && node.sourceCodeLocation) {
        const tagLoc = node.sourceCodeLocation.startTag;
        if (tagLoc) {
          const origTag = originalHtml.slice(tagLoc.startOffset, tagLoc.endOffset);
          const newTag = origTag.replace(/lang="[^"]*"/i, 'lang="fa" dir="rtl"').replace(/<html(?!\s+lang)/i, '<html lang="fa" dir="rtl"');
          addRepl(tagLoc.startOffset, tagLoc.endOffset, newTag);
        }
      }

      // 2. <head> injection
      if (node.nodeName === 'head' && node.sourceCodeLocation) {
        const tagLoc = node.sourceCodeLocation.startTag;
        if (tagLoc) {
          addRepl(tagLoc.endOffset, tagLoc.endOffset, FA_HEAD_INJECTION);
        }
      }

      // 3. <title>
      if (node.nodeName === 'title' && node.childNodes?.[0]?.sourceCodeLocation) {
        const tNode = node.childNodes[0];
        const origTitle = tNode.value;
        const newTitle = translateText(origTitle);
        addRepl(tNode.sourceCodeLocation.startOffset, tNode.sourceCodeLocation.endOffset, newTitle);
      }

      // 4. Meta tags (description, og:*, canonical, alternate/hreflang)
      if (node.nodeName === 'meta' && node.sourceCodeLocation) {
        const name = node.attrs?.find((a) => a.name === 'name')?.value;
        const prop = node.attrs?.find((a) => a.name === 'property')?.value;
        const content = node.attrs?.find((a) => a.name === 'content')?.value;

        if (name === 'description' && content && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          const translated = escapeHtml(translateText(content));
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="${translated}"`);
        } else if (prop === 'og:title' && content && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="${escapeHtml(translateText(content))}"`);
        } else if (prop === 'og:description' && content && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="${escapeHtml(translateText(content))}"`);
        } else if (prop === 'og:site_name' && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="وید اکوستیکس"`);
        } else if (prop === 'og:locale' && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="fa_IR"`);
        } else if (prop === 'og:url' && node.sourceCodeLocation.attrs?.content) {
          const cLoc = node.sourceCodeLocation.attrs.content;
          addRepl(cLoc.startOffset, cLoc.endOffset, `content="${faUrl}"`);
        }
      }

      // 5. Canonical link & hreflangs
      if (node.nodeName === 'link' && node.sourceCodeLocation) {
        const rel = node.attrs?.find((a) => a.name === 'rel')?.value;
        if (rel === 'canonical' && node.sourceCodeLocation.attrs?.href) {
          const hLoc = node.sourceCodeLocation.attrs.href;
          addRepl(hLoc.startOffset, hLoc.endOffset, `href="${faUrl}"`);
        }
        if (rel === 'alternate' && node.sourceCodeLocation) {
          // Remove old Weglot hreflangs entirely
          addRepl(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset, '');
        }
      }

      // 6. Weglot Data & Front Scripts (remove)
      if (node.nodeName === 'script' && node.sourceCodeLocation) {
        const id = node.attrs?.find((a) => a.name === 'id')?.value;
        const src = node.attrs?.find((a) => a.name === 'src')?.value;
        if (id === 'weglot-data' || src?.includes('front-js.js') || id === 'wp-weglot-js-js') {
          addRepl(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset, '');
        }
      }

      // 7. Header & Footer Logo (inline SVG replacement)
      if (node.attrs?.some((a) => a.name === 'class' && a.value.includes('header-logo'))) {
        // Find inner svg
        const svgChild = node.childNodes?.find((c) => c.nodeName === 'svg');
        if (svgChild?.sourceCodeLocation) {
          addRepl(svgChild.sourceCodeLocation.startOffset, svgChild.sourceCodeLocation.endOffset, FA_LOGO_SVG);
        }
      }

      // 8. Custom Logo images (replace src with /void_fa_logo.svg)
      if (node.nodeName === 'img' && node.attrs?.some((a) => a.name === 'class' && a.value.includes('custom-logo'))) {
        if (node.sourceCodeLocation?.attrs?.['data-src']) {
          const sLoc = node.sourceCodeLocation.attrs['data-src'];
          addRepl(sLoc.startOffset, sLoc.endOffset, `data-src="/void_fa_logo.svg"`);
        }
        if (node.sourceCodeLocation?.attrs?.src) {
          const sLoc = node.sourceCodeLocation.attrs.src;
          const origSrc = node.attrs.find((a) => a.name === 'src')?.value;
          if (!origSrc.startsWith('data:')) {
            addRepl(sLoc.startOffset, sLoc.endOffset, `src="/void_fa_logo.svg"`);
          }
        }
        if (node.sourceCodeLocation?.attrs?.alt) {
          const aLoc = node.sourceCodeLocation.attrs.alt;
          addRepl(aLoc.startOffset, aLoc.endOffset, `alt="وید اکوستیکس"`);
        }
      }

      // 9. Language Switcher (<aside class="...weglot-dropdown...">)
      if (node.nodeName === 'aside' && node.attrs?.some((a) => a.name === 'class' && a.value.includes('weglot-dropdown'))) {
        if (node.sourceCodeLocation) {
          const switcherHtml = `
<aside data-wg-notranslate="" class="country-selector weglot-dropdown close_outside_click closed weglot-shortcode wg-" tabindex="0" aria-expanded="false" aria-label="زبان انتخاب شده: فارسی">
	<input id="wg_choice_fa" class="weglot_choice" type="checkbox" name="menu"/>
	<label data-l="fa" tabindex="-1" for="wg_choice_fa" class="wgcurrent wg-li weglot-lang weglot-language flag-3 wg-fa" data-code-language="wg-fa" data-name-language="FA">
		<span class="wglanguage-name">FA</span>
	</label>
	<ul role="none">
		<li data-l="en" class="wg-li weglot-lang weglot-language flag-3 wg-en" role="option">
			<a title="Language: English" class="weglot-language-en" role="option" href="${enPath}">EN</a>
		</li>
	</ul>
</aside>`;
          addRepl(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset, switcherHtml);
        }
      }

      // 10. Translatable attributes on elements (alt, title, aria-label, placeholder)
      if (node.attrs && node.sourceCodeLocation?.attrs) {
        for (const attr of node.attrs) {
          if (['alt', 'title', 'aria-label', 'placeholder'].includes(attr.name)) {
            const loc = node.sourceCodeLocation.attrs[attr.name];
            if (loc && attr.value && attr.value.trim().length > 1) {
              const trans = translateAttr(attr.name, attr.value);
              if (trans !== attr.value) {
                addRepl(loc.startOffset, loc.endOffset, `${attr.name}="${escapeHtml(trans)}"`);
              }
            }
          }
        }
      }

      // 11. Text nodes
      if (node.nodeName === '#text' && node.sourceCodeLocation) {
        const parent = node.parentNode?.nodeName;
        if (parent !== 'script' && parent !== 'style' && parent !== 'noscript' && parent !== 'title') {
          const val = node.value;
          if (val && val.trim().length > 1) {
            const trans = translateText(val);
            if (trans !== val) {
              addRepl(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset, trans);
            }
          }
        }
      }

      // Recurse children
      if (node.childNodes) {
        for (const child of node.childNodes) traverse(child);
      }
    }

    traverse(doc);

    // Inject clean hreflang tags into head
    const headLoc = doc.childNodes
      ?.find((c) => c.nodeName === 'html')
      ?.childNodes?.find((c) => c.nodeName === 'head')?.sourceCodeLocation?.startTag;
    if (headLoc) {
      const hreflangs = `
	<link rel="alternate" href="${faPath}" hreflang="fa" />
	<link rel="alternate" href="${enPath}" hreflang="en" />
	<link rel="alternate" href="${faPath}" hreflang="x-default" />
`;
      addRepl(headLoc.endOffset, headLoc.endOffset, hreflangs);
    }

    // Sort replacements descending by startOffset, then endOffset descending
    replacements.sort((a, b) => b.startOffset - a.startOffset || b.endOffset - a.endOffset);

    // Apply only strictly non-overlapping replacements
    const cleanReplacements = [];
    let lastStart = Infinity;
    for (const r of replacements) {
      if (r.endOffset <= lastStart) {
        cleanReplacements.push(r);
        lastStart = r.startOffset;
      }
    }

    // Apply replacements cleanly
    let faHtml = originalHtml;
    for (const r of cleanReplacements) {
      faHtml = faHtml.slice(0, r.startOffset) + r.replacement + faHtml.slice(r.endOffset);
    }

    // Determine target file for Persian page
    const targetFile = cleanSlug === '' ? path.join(ROOT_MIRROR, 'index.html') : path.join(ROOT_MIRROR, cleanSlug, 'index.html');

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, faHtml, 'utf8');
    faCount++;

    // ==========================================
    // 2. UPDATE ENGLISH PAGE (mirror/en/<slug>/index.html)
    // ==========================================
    // Clean up Weglot switcher, remove scripts, set clean hreflangs
    let enHtml = originalHtml;

    // Replace weglot aside switcher in English page
    const enSwitcherHtml = `
<aside data-wg-notranslate="" class="country-selector weglot-dropdown close_outside_click closed weglot-shortcode wg-" tabindex="0" aria-expanded="false" aria-label="Language selected: English">
	<input id="wg_choice_en" class="weglot_choice" type="checkbox" name="menu"/>
	<label data-l="en" tabindex="-1" for="wg_choice_en" class="wgcurrent wg-li weglot-lang weglot-language flag-3 wg-en" data-code-language="wg-en" data-name-language="EN">
		<span class="wglanguage-name">EN</span>
	</label>
	<ul role="none">
		<li data-l="fa" class="wg-li weglot-lang weglot-language flag-3 wg-fa" role="option">
			<a title="زبان: فارسی" class="weglot-language-fa" role="option" href="${faPath}">FA</a>
		</li>
	</ul>
</aside>`;

    enHtml = enHtml.replace(/<aside[^>]*class="[^"]*weglot-dropdown[^"]*"[^>]*>[\s\S]*?<\/aside>/i, enSwitcherHtml);

    // Remove weglot scripts
    enHtml = enHtml.replace(/<script[^>]*src="[^"]*front-js\.js[^"]*"[^>]*><\/script>/gi, '');
    enHtml = enHtml.replace(/<script[^>]*id="weglot-data"[^>]*>[\s\S]*?<\/script>/gi, '');

    // Replace hreflang alternates
    enHtml = enHtml.replace(/<link[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*\/?>\s*/gi, '');
    const enHreflangs = `
	<link rel="alternate" href="${faPath}" hreflang="fa" />
	<link rel="alternate" href="${enPath}" hreflang="en" />
	<link rel="alternate" href="${faPath}" hreflang="x-default" />
`;
    enHtml = enHtml.replace(/<head>/i, `<head>${enHreflangs}`);

    fs.writeFileSync(file, enHtml, 'utf8');
    enUpdated++;
  }

  console.log(`\nCompilation Complete:`);
  console.log(`  Persian pages generated: ${faCount}`);
  console.log(`  English pages updated:   ${enUpdated}`);
}

compileAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
