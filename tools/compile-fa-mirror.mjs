import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const EN_DIR = path.join(process.cwd(), 'mirror', 'en');
const ROOT_MIRROR = path.join(process.cwd(), 'mirror');

// Load full glossary
const glossary = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));
const headingTranslationsPath = 'tools/fa-heading-translations.json';
const headingTranslations = fs.existsSync(headingTranslationsPath)
  ? JSON.parse(fs.readFileSync(headingTranslationsPath, 'utf8'))
  : {};

// Human-reviewed copy for the most visible journeys. These entries take
// precedence over the machine-built glossary so the Persian site reads like a
// considered local edition instead of a word-for-word translation.
const curatedTranslations = {
  'Where nightlife meets hospitality': 'جایی که هیجان شب با مهمان‌نوازی پیوند می‌خورد',
  'Discover your space': 'فضای مناسب خود را پیدا کنید',
  'Browse products': 'مشاهده محصولات',
  'Make it unmistakably yours': 'امضای منحصربه‌فرد شما',
  'Explore custom finishes': 'رنگ و پرداخت سفارشی',
  'Proven night after night': 'آزموده‌شده، شب پس از شب',
  'Learn the history': 'داستان وید را بخوانید',
  'Hear. Feel. Connect.': 'بشنوید. حس کنید. پیوند بسازید.',
  'Different by design': 'طراحی که متفاوت شنیده می‌شود',
  'Materially different': 'تفاوت از جنس متریال',
  'Distinctive audio solutions crafted in fibreglass, refined with Natural Wood, and engineered for the road.': 'راهکارهای صوتی شاخص؛ ساخته‌شده از فایبرگلاس، تکمیل‌شده با چوب طبیعی و مهندسی‌شده برای اجرا.',
  'Explore products': 'مشاهده محصولات',
  'Made to be custom': 'ساخته‌شده برای شما',
  'Bespoke colours and finishes designed to complement your brand, venue, and environment.': 'رنگ‌ها و پرداخت‌های سفارشی که با هویت برند، معماری و فضای شما هماهنگ می‌شوند.',
  'Discover customisation': 'سفارشی‌سازی را ببینید',
  'Born in nightlife': 'زادهٔ فرهنگ شب',
  'Audio systems shaped by 25 years of nightlife heritage and trusted across venues worldwide.': 'سیستم‌های صوتی با پشتوانهٔ ۲۵ سال تجربه در فرهنگ شب و مورد اعتماد مجموعه‌ها در سراسر جهان.',
  'Learn about Void': 'آشنایی با وید',
  'Sound for every setting': 'صدایی برای هر فضا',
  'Join the movement': 'به جریان وید بپیوندید',
  'Hear Void': 'صدای وید را تجربه کنید',
  'Explore real-world installations near you or experience Void in person at upcoming events.': 'اجرای واقعی سیستم‌های وید را در نزدیکی خود پیدا کنید یا در رویدادهای پیش رو تجربه‌شان کنید.',
  'Explore installations': 'مشاهده پروژه‌ها',
  'Design your project': 'پروژه‌تان را با صدای درست آغاز کنید',
  'Create the right audio solution for your bar, hotel, restaurant, retail space, or venue with support from our team.': 'با همراهی تیم ما، راهکار صوتی مناسب برای بار، هتل، رستوران، فروشگاه یا مجموعهٔ خود را طراحی کنید.',
  'Start your project': 'شروع طراحی پروژه',
  'Find a partner': 'نمایندهٔ مورد تأیید را پیدا کنید',
  'Search for an approved Void partner for design, supply, installation, and local support.': 'برای طراحی، تأمین، نصب و پشتیبانی محلی، نزدیک‌ترین همکار رسمی وید را پیدا کنید.',
  'Locate a partner': 'یافتن نماینده',
  'Explore the full range': 'همهٔ محصولات را ببینید',
  'High-impact statement loudspeakers for premium entertainment environments': 'بلندگوهایی با حضور بصری و صوتی قدرتمند برای فضاهای سرگرمی ممتاز',
  'High-impact statement loudspeakers for premium entertainment environments.': 'بلندگوهایی با حضور بصری و صوتی قدرتمند برای فضاهای سرگرمی ممتاز.',
  'Versatile loudspeakers for hospitality and outdoor environments': 'بلندگوهای منعطف برای فضاهای پذیرایی و محیط‌های باز',
  'Versatile loudspeakers for hospitality and outdoor environments.': 'بلندگوهای منعطف برای فضاهای پذیرایی و محیط‌های باز.',
  'Comprehensive loudspeaker range for discreet contemporary interiors': 'مجموعه‌ای کامل از بلندگوها برای فضاهای داخلی مدرن و مینیمال',
  'Comprehensive loudspeaker range for discreet contemporary interiors.': 'مجموعه‌ای کامل از بلندگوها برای فضاهای داخلی مدرن و مینیمال.',
  'Precision amplification for complete system control and performance': 'تقویت دقیق برای کنترل کامل سیستم و اجرای بی‌نقص',
  'Precision amplification for complete system control and performance.': 'تقویت دقیق برای کنترل کامل سیستم و اجرای بی‌نقص.',
  'View all': 'مشاهده همه',
  'Premium apparel and accessories for the global Void community': 'پوشاک و اکسسوری‌های ممتاز برای دوستداران وید در سراسر جهان',
  'Shop merch': 'ورود به فروشگاه',
  'Supporting Documents': 'مستندات پشتیبان',
  'Full Specifications': 'مشخصات کامل',
  'key features': 'ویژگی‌های کلیدی',
  'Key features': 'ویژگی‌های کلیدی',
  'Accessories': 'لوازم جانبی',
  'Explore system design': 'راهنمای طراحی سیستم',
  'Understand what your space needs': 'نیاز صوتی فضای خود را بشناسید',
  'Every space deserves careful consideration to achieve the best possible performance.': 'هر فضا برای رسیدن به بهترین عملکرد ممکن، به بررسی دقیق نیاز دارد.',
  'Tell us about your space and goals': 'دربارهٔ فضا و هدفتان بگویید',
  'Define the right solution for you': 'راهکار مناسب را انتخاب کنید',
  'Connect with the right integration partner': 'به همکار اجرایی مناسب متصل شوید',
  'Case studies': 'پروژه‌های اجراشده',
  'Discover real world success stories': 'داستان پروژه‌های موفق را ببینید',
  'overview': 'معرفی',
  'Overview': 'معرفی',
  'Beach Pool & Rooftop': 'ساحل، استخر و روف‌تاپ',
  'Select Resource': 'انتخاب منبع',
  'Designed to work together': 'طراحی‌شده برای عملکرد هماهنگ',
  'View Technical Resources': 'مشاهده منابع فنی',
  'Support Docs & Accessories': 'مستندات پشتیبانی و لوازم جانبی',
  'Accessory Guide': 'راهنمای لوازم جانبی',
  'Related Products': 'محصولات مرتبط',
  'Download': 'دانلود',
  'Contact us': 'تماس با ما',
  'Read more': 'بیشتر بخوانید',
  'Manage options': 'مدیریت گزینه‌ها',
  'Manage services': 'مدیریت سرویس‌ها',
  'Deny': 'رد کردن',
  'Save': 'ذخیره',
  'Manage Cookies': 'مدیریت کوکی‌ها',
  'Stay ahead with our monthly newsletter featuring product updates, events, case studies and more.': 'با خبرنامهٔ ماهانهٔ ما از محصولات تازه، رویدادها و پروژه‌های جدید باخبر شوید.',
  'Hero Slider': 'اسلایدر اصلی',
  'Cards Slider': 'اسلایدر کارت‌ها',
  'White Void Acoustics Tri Motion': 'بلندگوی سفید ترای موشن وید اکوستیکس',
  'Natural Wood Customisation': 'سفارشی‌سازی با روکش چوب طبیعی',
  'Nightlife Heritage': 'میراث فرهنگ شب',
  'Bars and Restaurants': 'بارها و رستوران‌ها',
  'Beach, Pool and Rooftop': 'ساحل، استخر و روف‌تاپ',
  'Hotels and Resorts': 'هتل‌ها و اقامتگاه‌ها',
  'Health and Wellbeing': 'سلامت و تندرستی',
  'Fashion and Retail': 'مد و خرده‌فروشی',
  'Festivals and Events': 'جشنواره‌ها و رویدادها',
  'Arts and Culture': 'هنر و فرهنگ',
  'Apres': 'اَپره‌اسکی',
  'Hear Void Map': 'نقشهٔ تجربهٔ صدای وید',
  'Where to buy Void Acoustics': 'از کجا محصولات وید اکوستیکس را بخریم',
  'Incubus Series': 'سری اینکیوبس',
  'Nexus Series': 'سری نکسوس',
  'Your browser does not support the video tag.': 'مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.',
  'Flagship dance system for iconic nightlife and festival spaces': 'سیستم صوتی پرچمدار برای کلاب‌ها و جشنواره‌های شاخص',
  'Scalable modular system for immersive dance environments': 'سیستم ماژولار و توسعه‌پذیر برای تجربه‌ای فراگیر در فضای رقص',
  'Tour-grade systems for large-scale events and venues': 'سیستم‌های حرفه‌ای تور برای رویدادها و مجموعه‌های بزرگ',
  'Compact loudspeakers for design led hospitality spaces': 'بلندگوهای جمع‌وجور برای فضاهای پذیرایی با طراحی خاص',
  'Discreet ceiling loudspeakers for seamlessly integrated spaces': 'بلندگوهای سقفی ظریف برای هماهنگی کامل با معماری فضا',
  'A comprehensive overview of all Void subwoofers': 'معرفی کامل همهٔ ساب‌ووفرهای وید',
  'I consent to Void Acoustics collecting, processing, and storing my information in accordance with the Void Acoustics privacy notice.': 'با جمع‌آوری، پردازش و نگهداری اطلاعاتم مطابق اطلاعیهٔ حریم خصوصی وید اکوستیکس موافقم.',
  'Subscribe': 'عضویت',
  '2026 Void Acoustics Ltd': '۲۰۲۶ وید اکوستیکس با مسئولیت محدود',
  'The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network.': 'ذخیره‌سازی یا دسترسی فنی فقط برای ارائهٔ سرویسی که کاربر درخواست کرده یا انتقال ارتباط از طریق شبکهٔ الکترونیکی ضروری است.',
  'Manage {vendor_count} vendors': 'مدیریت {vendor_count} ارائه‌دهنده',
  'Read more about these purposes': 'دربارهٔ این موارد بیشتر بخوانید',
  'Read more about TCF purposes on Cookie Database': 'دربارهٔ اهداف TCF در پایگاه دادهٔ کوکی بیشتر بخوانید'
};

Object.assign(glossary, headingTranslations, curatedTranslations);

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

		/* 2026 Persian art direction: cinematic, tactile, and image-led. */
		:root {
			--void-red: #ff1748;
			--void-red-deep: #a8002d;
			--void-ink: #070707;
			--void-ivory: #f3f0e9;
		}
		html[dir="rtl"] body {
			background: var(--void-ivory);
			font-feature-settings: "ss01", "ss02";
		}
		html[dir="rtl"] .site-header {
			margin: 14px 18px 0;
			width: calc(100% - 36px);
			border: 1px solid rgba(255,255,255,.14);
			border-radius: 18px;
			color: #fff;
			background: rgba(7,7,7,.72);
			box-shadow: 0 12px 40px rgba(0,0,0,.18);
			backdrop-filter: blur(18px) saturate(140%);
			-webkit-backdrop-filter: blur(18px) saturate(140%);
		}
		html[dir="rtl"] .site-header .menu-dropdown { color: #111; }
		html[dir="rtl"] .hero-slider .min-h-screen-d::after {
			content: "";
			position: absolute;
			inset: 0;
			z-index: 25;
			pointer-events: none;
			background:
				radial-gradient(circle at 74% 40%, transparent 0 24%, rgba(0,0,0,.14) 55%),
				linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.22) 58%, rgba(0,0,0,.62));
		}
		html[dir="rtl"] .hero-slider .page-width { max-width: 1180px; }
		html[dir="rtl"] .hero-slider .component-heading {
			max-width: 16ch;
			font-size: clamp(3rem, 6.8vw, 7.25rem);
			font-weight: 780;
			line-height: 1.08;
			text-wrap: balance;
			text-shadow: 0 8px 32px rgba(0,0,0,.38);
		}
		html[dir="rtl"] .button {
			border-radius: 999px !important;
			padding-inline: 1.65rem !important;
			box-shadow: 0 10px 28px rgba(0,0,0,.14);
			transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease !important;
		}
		html[dir="rtl"] .button:hover {
			transform: translateY(-2px);
			box-shadow: 0 16px 38px rgba(0,0,0,.22);
		}
		html[dir="rtl"] .button--red { background: var(--void-red) !important; }
		html[dir="rtl"] main > section:not(.hero-slider) {
			position: relative;
			isolation: isolate;
		}
		html[dir="rtl"] main > section:not(.hero-slider) .component-heading {
			font-weight: 720;
			line-height: 1.2;
		}
		html[dir="rtl"] .bg-surface-200 {
			background-color: var(--void-ivory) !important;
		}
		html[dir="rtl"] .rounded-2xl {
			border-radius: 26px !important;
		}
		html[dir="rtl"] .grid > .rounded-2xl,
		html[dir="rtl"] .grid > div > .rounded-2xl {
			border: 1px solid rgba(255,255,255,.12);
			box-shadow: 0 24px 70px rgba(0,0,0,.14);
			transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
		}
		html[dir="rtl"] .grid > .rounded-2xl:hover,
		html[dir="rtl"] .grid > div > .rounded-2xl:hover {
			transform: translateY(-8px);
			box-shadow: 0 32px 80px rgba(0,0,0,.22);
		}
		html[dir="rtl"] .cards-slider-gradient {
			background:
				radial-gradient(circle at 12% 30%, rgba(255,23,72,.24), transparent 34%),
				linear-gradient(135deg, #050505 0%, #160008 58%, #33000f 100%) !important;
			border-top: 1px solid rgba(255,255,255,.08);
		}
		html[dir="rtl"] .cards-slider-gradient .splide__slide > .rounded-2xl {
			border: 1px solid rgba(255,255,255,.16);
			box-shadow: 0 24px 60px rgba(0,0,0,.34);
		}
		html[dir="rtl"] .text-eyebrow {
			display: inline-flex;
			align-items: center;
			gap: .65rem;
			font-weight: 750;
		}
		html[dir="rtl"] .text-eyebrow::before {
			content: "";
			width: 2.25rem;
			height: 2px;
			background: currentColor;
		}
		html[dir="rtl"] .fa-signature-rail {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			background: #090909;
			color: white;
			border-block: 1px solid rgba(255,255,255,.1);
		}
		html[dir="rtl"] .fa-signature-rail a {
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto auto;
			gap: .15rem 1rem;
			padding: 1.75rem clamp(1rem, 3vw, 3.5rem);
			color: white;
			border-inline-start: 1px solid rgba(255,255,255,.1);
			transition: background .25s ease;
		}
		html[dir="rtl"] .fa-signature-rail a:hover { background: rgba(255,23,72,.16); }
		html[dir="rtl"] .fa-signature-rail span {
			grid-row: 1 / 3;
			align-self: center;
			color: var(--void-red);
			font-size: .78rem;
			font-weight: 800;
		}
		html[dir="rtl"] .fa-signature-rail strong { font-size: 1.05rem; }
		html[dir="rtl"] .fa-signature-rail small { color: rgba(255,255,255,.62); }
		html[dir="rtl"] .footer-cta-block {
			background-position: left center !important;
			text-align: right !important;
			border: 1px solid rgba(255,255,255,.18);
			box-shadow: 0 30px 90px rgba(0,0,0,.32);
		}
		html[dir="rtl"] .footer-cta-block > .flex-1 { padding-left: min(42vw, 480px); }
		html[dir="rtl"] .footer-cta-block .component-heading {
			font-size: clamp(1.8rem, 3vw, 3.25rem);
			line-height: 1.3;
		}
		@media (max-width: 767px) {
			html[dir="rtl"] .site-header {
				margin: 8px 8px 0;
				width: calc(100% - 16px);
				border-radius: 14px;
			}
			html[dir="rtl"] .hero-slider .component-heading { font-size: clamp(2.5rem, 12vw, 4.4rem); }
			html[dir="rtl"] .fa-signature-rail { grid-template-columns: 1fr; }
			html[dir="rtl"] .fa-signature-rail a { border-top: 1px solid rgba(255,255,255,.1); }
			html[dir="rtl"] .footer-cta-block {
				background-position: center bottom !important;
				background-size: 115% auto !important;
				padding-bottom: 68% !important;
			}
			html[dir="rtl"] .footer-cta-block > .flex-1 { padding-left: 0; }
		}
		@media (prefers-reduced-motion: reduce) {
			html[dir="rtl"] *, html[dir="rtl"] *::before, html[dir="rtl"] *::after {
				scroll-behavior: auto !important;
				transition-duration: .01ms !important;
			}
		}
		@media (max-width: 959px) {
			html[dir="rtl"] body.side-menu-open { overflow: hidden !important; }
			html[dir="rtl"] .site-header,
			html[dir="rtl"] body.side-menu-open .site-header {
				z-index: 1000 !important;
				color: #fff !important;
				background: rgba(7,7,7,.94) !important;
			}
			html[dir="rtl"] .site-header .page-width,
			html[dir="rtl"] .site-header .page-width > .flex { height: 62px; }
			html[dir="rtl"] #primary-menu.side-menu {
				position: fixed !important;
				top: 77px !important;
				right: 8px !important;
				bottom: 8px !important;
				left: 8px !important;
				width: auto !important;
				height: calc(100dvh - 85px) !important;
				padding: 12px 20px 26px !important;
				border: 1px solid rgba(255,255,255,.12) !important;
				border-top: 0 !important;
				border-radius: 0 0 22px 22px !important;
				background: rgba(7,7,7,.98) !important;
				box-shadow: 0 24px 70px rgba(0,0,0,.44) !important;
				color: #fff !important;
				overflow: hidden !important;
			}
			html[dir="rtl"] #menu-main-nav {
				position: relative !important;
				inset: auto !important;
				display: flex !important;
				flex-direction: column !important;
				align-items: stretch !important;
				gap: 0 !important;
				width: 100% !important;
				height: 100% !important;
				padding: 4px 2px 72px !important;
				overflow-x: hidden !important;
				overflow-y: auto !important;
				overscroll-behavior: contain;
				scrollbar-width: thin;
			}
			html[dir="rtl"] #menu-main-nav > li {
				position: relative !important;
				flex: 0 0 auto !important;
				width: 100% !important;
				border-bottom: 1px solid rgba(255,255,255,.11) !important;
			}
			html[dir="rtl"] #menu-main-nav > li > a {
				display: flex !important;
				align-items: center !important;
				justify-content: space-between !important;
				min-height: 54px !important;
				padding: 0 4px !important;
				color: #fff !important;
				font-size: 1.05rem !important;
				font-weight: 620 !important;
				line-height: 1.45 !important;
			}
			html[dir="rtl"] #menu-main-nav > li > a::after {
				content: "‹";
				color: var(--void-red);
				font-size: 1.65rem;
				font-weight: 700;
				line-height: 1;
				opacity: .9;
			}
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar { width: 4px; }
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar-track { background: transparent; }
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar-thumb {
				border-radius: 999px;
				background: rgba(255,255,255,.26);
			}
			html[dir="rtl"] #menu-main-nav > li > a > svg { display: none !important; }
			html[dir="rtl"] #menu-main-nav .menu-dropdown { display: none !important; }
			html[dir="rtl"] #primary-menu-toggle {
				position: relative;
				z-index: 1100;
				color: #fff !important;
			}
			html[dir="rtl"] #primary-menu-toggle .menu-button span { background-color: currentColor !important; }
			html[dir="rtl"] body.side-menu-open #primary-menu-toggle {
				width: 42px;
				height: 42px;
				border-radius: 999px;
				background: rgba(255,255,255,.09);
			}
			html[dir="rtl"] #primary-menu .mobile-menu-back-button { display: none !important; }
		}
	</style>
	<script id="fa-image-hydration">
		document.addEventListener('DOMContentLoaded', function () {
			var hydrate = function (img) {
				if (img.dataset.src) img.src = img.dataset.src;
				if (img.dataset.srcset) img.srcset = img.dataset.srcset;
				if (img.dataset.sizes) img.sizes = img.dataset.sizes;
			};
			var images = document.querySelectorAll('img[data-src]');
			if (!('IntersectionObserver' in window)) {
				images.forEach(hydrate);
				return;
			}
			var observer = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					hydrate(entry.target);
					observer.unobserve(entry.target);
				});
			}, { rootMargin: '400px 0px' });
			images.forEach(function (img) {
				img.loading = 'lazy';
				observer.observe(img);
			});
		});
	</script>
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

      // 10. Translatable attributes on elements (including submit labels)
      if (node.attrs && node.sourceCodeLocation?.attrs) {
        for (const attr of node.attrs) {
          if (['alt', 'title', 'aria-label', 'placeholder', 'value'].includes(attr.name)) {
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

    // Parent-level replacements can overlap translated child nodes in parse5.
    // Normalize the language control and consent copy after DOM edits so these
    // global interface elements are consistently Persian on every page.
    const persianSwitcher = `
<aside data-wg-notranslate="" class="country-selector weglot-dropdown close_outside_click closed weglot-shortcode wg-" tabindex="0" aria-expanded="false" aria-label="تغییر زبان به انگلیسی">
	<input id="wg_choice_fa" class="weglot_choice" type="checkbox" name="menu"/>
	<label data-l="fa" tabindex="-1" for="wg_choice_fa" class="wgcurrent wg-li weglot-lang weglot-language flag-3 wg-fa" data-code-language="wg-fa" data-name-language="FA">
		<span class="wglanguage-name">FA</span>
	</label>
	<ul role="none">
		<li data-l="en" class="wg-li weglot-lang weglot-language flag-3 wg-en" role="option">
			<a title="English" class="weglot-language-en" role="option" href="${enPath}">EN</a>
		</li>
	</ul>
</aside>`;
    faHtml = faHtml.replace(/<aside[^>]*class="[^"]*weglot-dropdown[^"]*"[^>]*>[\s\S]*?<\/aside>/i, persianSwitcher);
    faHtml = faHtml
      .replace(
        'We use necessary cookies to make our site work. We also have performance based analytic cookies to help us improve our site and your user experience. Using this tool will set a cookie on your device to remember your preferences.',
        'برای عملکرد درست سایت از کوکی‌های ضروری استفاده می‌کنیم. کوکی‌های آماری نیز کمک می‌کنند تجربهٔ شما را بهتر کنیم. انتخاب شما روی همین دستگاه ذخیره می‌شود.'
      )
      .replace(/>Cookie Policy</g, '>سیاست کوکی‌ها<')
      .replace(/>Privacy Policy</g, '>سیاست حفظ حریم خصوصی<');
    // Some technical headings contain inline markup such as <sup>. Translate
    // their complete visible label after the node-level pass so no English
    // fragments remain around those tags.
    faHtml = faHtml.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
      const plain = inner
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const translated = translateText(plain).trim();
      return translated !== plain ? `<${tag}${attrs}>${escapeHtml(translated)}</${tag}>` : full;
    });
    faHtml = faHtml.replace(/(\/wp-content\/themes\/void2025\/js\/app\.js)(?:\?[^"']*)?/g, '$1?v=20261020-fa3');

    // Give the Persian homepage a compact editorial bridge between the
    // cinematic hero and the product story, using the same visual language.
    if (cleanSlug === '') {
      const signatureRail = `
<section class="fa-signature-rail" aria-label="ویژگی‌های طراحی وید">
	<a href="/products/"><span>۰۱</span><strong>فرم مجسمه‌وار</strong><small>صدایی که دیده می‌شود</small></a>
	<a href="/design/"><span>۰۲</span><strong>مهندسی صدای حرفه‌ای</strong><small>طراحی دقیق برای هر فضا</small></a>
	<a href="/customisation/"><span>۰۳</span><strong>هویت منحصربه‌فرد</strong><small>رنگ و پرداخت هماهنگ با پروژه</small></a>
</section>`;
      faHtml = faHtml.replace(/(<section[^>]*class="[^"]*hero-slider[\s\S]*?<\/section>)/i, `$1${signatureRail}`);
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
    enHtml = enHtml.replace(/(\/wp-content\/themes\/void2025\/js\/app\.js)(?:\?[^"']*)?/g, '$1?v=20261020-fa3');

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
