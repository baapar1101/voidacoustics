import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const replacements = [
  ['ترای موشن | بلندگوی سه‌راهه هورن‌لود | وید اکوستیکس', 'ترای موشن | بلندگوی سه‌راهه هورن‌لود حرفه‌ای | وید اکوستیکس'],
  ['Discover Tri Motion, a horn-loaded three-way بلندگو with triangular design.', 'ترای موشن، آرایهٔ بلندگوی سه‌راهه، بای‌امپ و هورن‌لود با موجبرهای مثلثی، پوشش‌دهی کنترل‌شدهٔ ۹۰ در ۶۰ درجه و توان خروجی بالا است.'],
  ['Tri Motion | Horn-Loaded Three-Way Loudspeaker | Void Acoustics', 'ترای موشن | بلندگوی سه‌راهه هورن‌لود حرفه‌ای | وید اکوستیکس'],
  ['Discover Tri Motion, a horn-loaded three-way loudspeaker with triangular design.', 'ترای موشن، آرایهٔ بلندگوی سه‌راهه، بای‌امپ و هورن‌لود با موجبرهای مثلثی، پوشش‌دهی کنترل‌شدهٔ ۹۰ در ۶۰ درجه و توان خروجی بالا است.'],
  ['"inLanguage":"en-GB"', '"inLanguage":"fa-IR"'],
  ['"name":"Home"', '"name":"خانه"'],
  ['"name":"Air Series"', '"name":"سری Air"'],
  ['"name":"Tri Motion"', '"name":"ترای موشن"'],
  ['سری Air', 'سری ایر (Air)'],

  ['A high-output, three-way, bi-amped sculpted loudspeaker array with triangular waveguides.', 'آرایهٔ بلندگوی سه‌راهه، بای‌امپ و توان‌بالا با بدنه‌ای حجمی و موجبرهای مثلثی.'],
  ['مشاهده منابع فنی', 'مشاهدهٔ منابع فنی'],
  ['طرح مثلثی حجاری شده با پوشش کنترل شده', 'طراحی مثلثی شاخص با پوشش‌دهی دقیق و کنترل‌شده'],
  ['The Tri Motion is designed for high-output, combining controlled wide 90°H x 60°V dispersion with efficient performance. Its low-resonance fibreglass composite construction supports consistent sound reproduction, while its distinctive form makes it suitable for visually-led environments.', 'ترای موشن برای تولید تراز صوتی بالا طراحی شده و زاویهٔ پوشش گسترده اما کنترل‌شدهٔ ۹۰ درجه افقی در ۶۰ درجه عمودی را با بازده بالا ترکیب می‌کند. بدنهٔ کامپوزیت فایبرگلاس با رزونانس پایین، بازتولید یکنواخت و شفاف صدا را ممکن می‌سازد و فرم متمایز آن، این سیستم را برای فضاهایی با معماری و هویت بصری برجسته مناسب می‌کند.'],
  ['Tri Motion Overview', 'نمای کلی بلندگوی ترای موشن'],
  ['Visually-striking loudspeaker', 'بلندگویی با هویت بصری شاخص'],
  ['Horn-loaded design', 'طراحی هورن‌لود'],
  ['Low-resonance enclosure', 'کابینت با رزونانس پایین'],
  ['Custom finishes available', 'امکان سفارش رنگ و پرداخت اختصاصی'],
  ['پروژه‌های اجراشده', 'نمونه‌های نصب در پروژه‌ها'],

  ['سفارشی‌سازی انعطاف‌پذیر', 'انعطاف‌پذیری در نصب و سفارشی‌سازی'],
  ['Designed for a range of environments, the Tri Motion offers flexible installation through an integrated flying and mounting system, and is available in left and right configurations.', 'ترای موشن برای طیف متنوعی از فضاها طراحی شده است. سیستم یکپارچهٔ آویز و نصب، اجرای انعطاف‌پذیر را ممکن می‌کند و محصول در دو آرایش چپ و راست عرضه می‌شود.'],
  ['Available as standard in red, black, and white. Custom RAL and KROME finishes are available upon request.', 'رنگ‌های استاندارد قرمز، مشکی و سفید هستند. رنگ‌های سفارشی RAL و پرداخت‌های KROME نیز بنا به سفارش ارائه می‌شوند.'],
  ['Available as standard in red, black, and white', 'عرضهٔ استاندارد در رنگ‌های قرمز، مشکی و سفید'],
  ['Custom RAL and KROME finishes are available upon request', 'امکان سفارش رنگ‌های RAL و پرداخت‌های KROME'],
  ['View accessories', 'مشاهدهٔ لوازم جانبی'],
  ['Explore customisation options', 'بررسی گزینه‌های سفارشی‌سازی'],
  ['کنترل الگوی پیشرفته', 'کنترل دقیق الگوی انتشار'],
  ['Triangular format waveguides provide enhanced pattern control, supporting consistent dispersion across large spaces. Low-resonance construction helps reduce unwanted vibration, maintaining clarity and definition during operation.', 'موجبرهای مثلثی، الگوی انتشار صدا را با دقت بیشتری کنترل می‌کنند و پوشش یکنواخت‌تری در فضاهای بزرگ به دست می‌دهند. ساختار کم‌رزونانس نیز ارتعاشات ناخواسته را کاهش می‌دهد تا شفافیت، تفکیک و دقت صدا در ترازهای کاری بالا حفظ شود.'],

  ['آرایه بلندگوهای حجاری شده سه طرفه دو آمپر', 'آرایهٔ بلندگوی سه‌راهه و بای‌امپ با طراحی حجمی'],
  ['موجبرهای با فرمت مثلثی برای کنترل دقیق الگوی انتشار', 'موجبرهای مثلثی برای کنترل دقیق الگوی انتشار'],
  ['موجبرهای با فرمت مثلثی برای کنترل الگوی پیشرفته', 'موجبرهای مثلثی برای کنترل دقیق الگوی انتشار'],
  ['پراکندگی گسترده ۹۰°H x ۶۰°V برای پوشش کنترل شده', 'پوشش‌دهی کنترل‌شدهٔ ۹۰° افقی × ۶۰° عمودی'],
  ['از پیش تنظیم شده FIR با تقویت کننده های وید', 'پیش‌تنظیم بهینه‌شده با فیلتر FIR برای آمپلی‌فایرهای وید'],
  ['پریست بهینه‌سازی‌شده با فیلتر FIR برای آمپلی‌فایرهای Void', 'پیش‌تنظیم بهینه‌شده با فیلتر FIR برای آمپلی‌فایرهای وید'],
  ['ساخت کامپوزیت فایبرگلاس کم رزونانس', 'بدنهٔ کامپوزیت فایبرگلاس با رزونانس پایین'],
  ['سیستم پرواز و نصب یکپارچه', 'سیستم یکپارچهٔ آویز و نصب'],
  ['ظاهر بصری چشمگیر برای محیط های سبک رهبری شده', 'هویت بصری شاخص برای فضاهای طراحی‌محور'],
  ['در پیکربندی چپ و راست موجود است', 'عرضه در آرایش‌های چپ و راست'],
  ['Compact vertical footprint allows close proximity mounting to ceilings', 'ارتفاع کم بدنه برای نصب نزدیک به سقف'],
  ['رنگ‌های سفارشی رال و پرداخت کروم، بنا به سفارش', 'امکان سفارش رنگ‌های RAL و پرداخت‌های KROME'],

  ['کشف کنید', 'کاربردها'],
  ['جایی که ترای موشن اجرا می کند', 'کاربردهای پیشنهادی ترای موشن'],
  ['فستیوال‌ها و رویدادها', 'جشنواره‌ها و رویدادها'],
  ['>سلامت و اسپا<', '>مراکز سلامت و اسپا<'],
  ['فرهنگ کلاب و موسیقی الکترونیک', 'کلاب‌ها و موسیقی الکترونیک'],
  ['ترای موشن منابع فنی', 'منابع فنی ترای موشن'],
  ['انتخاب نوع منبع', 'انتخاب بخش'],
  ['مشخصات کامل', 'مشخصات فنی کامل'],
  ['مستندات پشتیبانی و لوازم جانبی', 'مستندات و لوازم جانبی'],

  ['125 Hz &#8211; 20 kHz', '۱۲۵ هرتز تا ۲۰ کیلوهرتز'],
  ['حداکثر تراز خروجی (SPL)', 'حداکثر تراز خروجی'],
  ['135 dB cont, 141 dB peak', '۱۳۵ دسی‌بل مداوم، ۱۴۱ دسی‌بل پیک'],
  ['135 dB مداوم، 141 dB پیک', '۱۳۵ دسی‌بل مداوم، ۱۴۱ دسی‌بل پیک'],
  ['Nominal Dispersion:', 'زاویهٔ پوشش اسمی:'],
  ['90°H x 60°V', '۹۰° افقی × ۶۰° عمودی'],
  ['حساسیت صوتی (Sensitivity)', 'حساسیت'],
  ['LF: 107 dB 1W/1m, MHF: 110 dB 1W/1m', 'LF: ۱۰۷ دسی‌بل (۱ وات/۱ متر)، MHF: ۱۱۰ دسی‌بل (۱ وات/۱ متر)'],
  ['LF: 107 dB (1 W/1 m)، MHF: 110 dB (1 W/1 m)', 'LF: ۱۰۷ دسی‌بل (۱ وات/۱ متر)، MHF: ۱۱۰ دسی‌بل (۱ وات/۱ متر)'],
  ['Driver Configuration:', 'پیکربندی درایورها:'],
  ['1 x 15&#8243; LF, 1 x 8&#8243; MF, 1 x 1.5&#8243; HF compression driver', '۱ × ووفر ۱۵ اینچ LF، ۱ × درایور ۸ اینچ MF، ۱ × درایور فشرده‌ساز ۱٫۵ اینچ HF'],
  ['Power Handling:', 'توان قابل‌تحمل:'],
  ['LF: 700 W AES, MHF: 250 W AES', 'LF: ۷۰۰ وات AES، MHF: ۲۵۰ وات AES'],
  ['LF: 700 W AES، MHF: 250 W AES', 'LF: ۷۰۰ وات AES، MHF: ۲۵۰ وات AES'],
  ['Nominal Impedance:', 'امپدانس اسمی:'],
  ['LF: 8 Ω, MHF: 8 Ω', 'LF: ۸ اهم، MHF: ۸ اهم'],
  ['LF: 8 Ω، MHF: 8 Ω', 'LF: ۸ اهم، MHF: ۸ اهم'],
  ['Suggested Minimum Amplifier:', 'حداقل آمپلی‌فایر پیشنهادی:'],
  ['Weight:', 'وزن:'],
  ['47.1 kg (103.8 lbs)', '۴۷٫۱ کیلوگرم (۱۰۳٫۸ پوند)'],
  ['Connections:', 'اتصالات:'],
  ['2 x 4-pin locking connector', '۲ × کانکتور قفل‌شوندهٔ ۴ پین'],
  ['Enclosure:', 'جنس کابینت:'],
  ['Fibreglass composite', 'کامپوزیت فایبرگلاس'],
  ['Finish:', 'نوع پرداخت:'],
  ['Smooth cellulose', 'سلولزی صاف'],
  ['Mounting:', 'نحوهٔ نصب:'],
  ['Integral mounting system', 'سیستم نصب یکپارچه'],
  ['Colour: ', 'رنگ: '],
  [' -10 dB IEC60268-5', ' در تراز ‎−۱۰ دسی‌بل، مطابق استاندارد IEC 60268-5'],
  ['Calculated', 'مقدار محاسبه‌شده'],
  ['Measured i</span><span class="NormalTextRun SCXW173438706 BCX0">n half space', 'اندازه‌گیری در شرایط نیم‌فضا</span><span class="NormalTextRun SCXW173438706 BCX0">'],

  ['Tri Motion راهنمای کاربر', 'راهنمای کاربر ترای موشن'],
  ['Tri Motion برگه مشخصات فنی', 'برگهٔ مشخصات فنی ترای موشن'],
  ['Tri Motion چپ نقشهٔ ابعادی (pdf)', 'نقشهٔ ابعادی نسخهٔ چپ ترای موشن (PDF)'],
  ['Tri Motion راست نقشهٔ ابعادی (pdf)', 'نقشهٔ ابعادی نسخهٔ راست ترای موشن (PDF)'],
  ['Tri Motion چپ نقشهٔ ابعادی (dwg)', 'نقشهٔ ابعادی نسخهٔ چپ ترای موشن (DWG)'],
  ['Tri Motion راست نقشهٔ ابعادی (dwg)', 'نقشهٔ ابعادی نسخهٔ راست ترای موشن (DWG)'],
  ['Tri Motion نسخهٔ چپ مدل سه‌بعدی', 'مدل سه‌بعدی نسخهٔ چپ ترای موشن'],
  ['Tri Motion نسخهٔ راست مدل سه‌بعدی', 'مدل سه‌بعدی نسخهٔ راست ترای موشن'],
  ['Tri Motion GLL', 'فایل GLL ترای موشن'],

  ['اتصال پایهٔ تقویت‌شده – مشکی', 'سوکت پایهٔ تقویت‌شده (Top Hat) – مشکی'],
  ['اتصال پایهٔ تقویت‌شده – سفید', 'سوکت پایهٔ تقویت‌شده (Top Hat) – سفید'],
  ['TU براکت سقفی (1000mm) – مشکی', 'براکت سقفی TU (۱۰۰۰ میلی‌متر) – مشکی'],
  ['TU براکت سقفی (1500mm) – مشکی', 'براکت سقفی TU (۱۵۰۰ میلی‌متر) – مشکی'],
  ['TU براکت سقفی (1500mm) – سفید', 'براکت سقفی TU (۱۵۰۰ میلی‌متر) – سفید'],
  ['TU براکت سقفی (500mm) – مشکی', 'براکت سقفی TU (۵۰۰ میلی‌متر) – مشکی'],
  ['TU براکت سقفی (500mm) – سفید', 'براکت سقفی TU (۵۰۰ میلی‌متر) – سفید'],
  ['TU براکت چندمنظوره (600mm) – مشکی', 'براکت چندمنظورهٔ TU (۶۰۰ میلی‌متر) – مشکی'],
  ['TU براکت چندمنظوره (600mm) – سفید', 'براکت چندمنظورهٔ TU (۶۰۰ میلی‌متر) – سفید'],
  ['TU براکت پیچی – مشکی', 'براکت اتصال رزوه‌ای TU – مشکی'],
  ['TU براکت پیچی – سفید', 'براکت اتصال رزوه‌ای TU – سفید'],
  ['TU براکت تراس – مشکی', 'براکت خرپا TU – مشکی'],
  ['TU براکت تراس – سفید', 'براکت خرپا TU – سفید'],

  ['4 channel amplifier for large systems', 'آمپلی‌فایر چهارکاناله برای سیستم‌های بزرگ'],
  ['Dual 18 inch horn-loaded subwoofer', 'ساب‌ووفر دوگانهٔ ۱۸ اینچی هورن‌لود'],
  ['Multi driver upper-bass enclosure', 'کابینت چنددرایوره برای محدودهٔ بالایی باس'],
  ['کابینت چنددرایورهٔ فرکانس‌های بالای باس', 'کابینت چنددرایوره برای محدودهٔ بالایی باس'],
  ['نیاز صوتی فضای خود را بشناسید', 'نیازهای صوتی فضای خود را دقیق تعریف کنید'],
  ['Every space deserves careful consideration to achieve the best possible performance. Loudspeaker and amplifier selection, placement, coverage and tuning all play a critical role in the final result. Our team can help you design the right system and get it right first time.', 'برای دستیابی به بهترین عملکرد، هر فضا باید بر اساس ابعاد، کاربری و شرایط آکوستیکی آن بررسی شود. انتخاب بلندگو و آمپلی‌فایر، محل نصب، زاویهٔ پوشش و تنظیم نهایی سیستم همگی بر نتیجه اثر مستقیم دارند. تیم ما کمک می‌کند راهکار مناسب را از ابتدا درست طراحی و اجرا کنید.'],
  ['دربارهٔ فضا و هدفتان بگویید', 'فضا و هدف پروژه را با ما در میان بگذارید'],
  ['راهکار مناسب را انتخاب کنید', 'راهکار فنی مناسب را تعریف کنید'],
  ['داستان پروژه‌های موفق را ببینید', 'نمونه‌های موفق اجرای ترای موشن'],
  ['مشاهده همه', 'مشاهدهٔ همه'],
  ['Gallery Slider', 'گالری تصاویر پروژه‌های ترای موشن'],
  ['aria-label="Link Accessory Guide"', 'aria-label="لینک راهنمای لوازم جانبی"'],
  ['title="English"', 'title="انگلیسی"'],
  ['alt="Customisation"', 'alt="سفارشی‌سازی"'],
  ['alt="Real wood finishes"', 'alt="روکش‌های چوب طبیعی"'],
  ['alt="Hear Void worldwide"', 'alt="شنیدن صدای وید در سراسر جهان"'],
  ['alt="Design your system"', 'alt="طراحی سیستم صوتی شما"'],
  ['alt="Festivals and Events"', 'alt="جشنواره‌ها و رویدادها"'],
  ['alt="Hotels and Resorts"', 'alt="هتل‌ها و اقامتگاه‌ها"'],
  ['alt="Bars and Restaurants"', 'alt="بارها و رستوران‌ها"'],
  ['alt="Health and Wellbeing"', 'alt="مراکز سلامت و اسپا"'],
  ['alt="Fashion and Retail"', 'alt="مد و فروشگاه‌های لوکس"'],
  ['alt="Club Culture"', 'alt="کلاب‌ها و موسیقی الکترونیک"'],
  ['alt="Void Acoustics"', 'alt="وید اکوستیکس"'],
];

export function polishTriMotionPersian(html) {
  for (const [source, target] of replacements) {
    html = html.replaceAll(source, target);
  }

  html = html
    .replaceAll('مراکز مراکز سلامت و اسپا', 'مراکز سلامت و اسپا')
    .replaceAll('مشاهدهٔ مشاهدهٔ راهنمای طراحی سیستم', 'مشاهدهٔ راهنمای طراحی سیستم')
    .replace(/>راهنمای طراحی سیستم(\s*)</g, '>مشاهدهٔ راهنمای طراحی سیستم$1<')
    .replaceAll('https://voidacoustics.com/products/air/trimotion//', 'https://voidacoustics.com/products/air/trimotion/')
    .replaceAll('/en/products/air/trimotion//', '/en/products/air/trimotion/')
    .replace(/(data-src="[^"]*Tri-motion-Header\.jpg"[^>]*?\balt=")"/gi, '$1بلندگوی ترای موشن وید اکوستیکس"')
    .replace(/(src="[^"]*Tri-motion-Header\.jpg"[^>]*?\balt=")"/gi, '$1بلندگوی ترای موشن وید اکوستیکس"')
    .replace(/(data-src="[^"]*Tri-Motion-Mobile-Header-1\.jpg"[^>]*?\balt=")"/gi, '$1نمای موبایل بلندگوی ترای موشن وید اکوستیکس"')
    .replace(/(src="[^"]*Tri-Motion-Mobile-Header-1\.jpg"[^>]*?\balt=")"/gi, '$1نمای موبایل بلندگوی ترای موشن وید اکوستیکس"')
    .replace(
      /<p><sup><strong><span class="TextRun SCXW173438706 BCX0"[\s\S]*?<\/p>/,
      '<p><sup><strong>۱</strong></sup> در تراز ‎−۱۰ دسی‌بل، مطابق استاندارد IEC 60268-5&nbsp;&nbsp; <sup><strong>۲</strong></sup> مقدار محاسبه‌شده&nbsp;&nbsp; <sup><strong>۳</strong></sup> اندازه‌گیری در شرایط نیم‌فضا</p>'
    );

  return html;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const targetPath = process.argv[2];
  if (!targetPath) {
    throw new Error('Usage: node tools/polish-trimotion-fa.mjs <html-file>');
  }
  const original = fs.readFileSync(targetPath, 'utf8');
  const polished = polishTriMotionPersian(original);
  fs.writeFileSync(targetPath, polished);
  console.log(`Polished Persian Tri Motion page: ${targetPath}`);
}
