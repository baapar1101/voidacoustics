/**
 * Shared URL rewriting for the Astro build.
 *
 * Sources are absolute-URL WordPress output, so every same-site reference has
 * to become root-relative for a domain-root static deploy.
 */

const HOST_RE = /https?:\/\/(?:www\.)?voidacoustics\.com(\/[^\s"'`)\\]*)?/g;
const PROTO_REL_RE = /(^|["'(=\s])\/\/(?:www\.)?voidacoustics\.com(\/[^\s"'`)\\]*)?/g;

// strip WP cache-busting. Value may be dotted (ver=6.1.7) or hex
// (ver=2c532d7e2be36f6af233) -- matching [0-9a-f]+ truncates at the first '.'
// and corrupts the filename into styles.css.1.7
const VER_RE = /(\/wp-(?:content|includes|json)\/[^\s"'`)]*?)\?ver=[^&\s"'`)]*/gi;

// Asset prefixes and extensions that should NEVER be prefixed with /en/
const ASSET_PATH_RE = /^\/(?:wp-content|wp-includes|wp-json|favicon|void_fa_logo|logo)(?:\/|$)/;
const FILE_EXT_RE = /\.(?:png|jpe?g|gif|webp|svg|ico|pdf|css|js|mjs|woff2?|ttf|otf|eot|mp4|webm|mp3|zip)(?:[?#]|$)/i;

function isAsset(p) {
  if (!p) return false;
  return ASSET_PATH_RE.test(p) || FILE_EXT_RE.test(p);
}

export function rewriteUrls(html, locale = 'fa') {
  const mapPath = (p) => {
    if (!p || p === '/') {
      return locale === 'en' ? '/en/' : '/';
    }
    let clean = p.startsWith('/') ? p : `/${p}`;
    if (isAsset(clean)) {
      return clean;
    }
    if (clean.startsWith('/en/') || clean === '/en') {
      return clean;
    }
    if (locale === 'en') {
      return `/en${clean}`;
    }
    return clean;
  };

  let out = html.replace(HOST_RE, (m, p) => mapPath(p));
  out = out.replace(PROTO_REL_RE, (m, pre, p) => `${pre}${mapPath(p)}`);
  out = out.replace(VER_RE, '$1');
  return out;
}

/** Strip the WP/host cruft that is meaningless on a static mirror. */
export function cleanHead(html) {
  return html
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["'](msvalidate\.01|google-site-verification)["'][^>]*>/gi, '');
}
