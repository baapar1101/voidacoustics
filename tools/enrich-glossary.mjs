import fs from 'node:fs';

const dict = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));

const additions = {
  // Footer & Contact & Locations
  'Hear Void worldwide': 'شنیدن صدای وید در سراسر جهان',
  'Design Your System': 'طراحی سیستم صوتی شما',
  'Europe:': 'اروپا:',
  'America:': 'آمریکا:',
  'United Kingdom': 'انگلستان',
  'Sign up to our newsletter': 'عضویت در خبرنامه',
  'Tune in with Void': 'همراه با وید اکوستیکس',
  'Stay ahead with our monthly newsletter featuring product updates, events, case studies, and more.':
    'با خبرنامه ماهانه ما شامل جدیدترین محصولات، رویدادها، پروژه‌ها و مقالات فنی، همواره پیشرو باشید.',
  'Premium apparel and accessories for the global Void community':
    'پوشاک و اکسسوری‌های اختصاصی و پریمیوم برای جامعه جهانی وید اکوستیکس',
  'Shop merch': 'فروشگاه محصولات اختصاصی',
  'Search site': 'جستجو در سایت',
  'Toggle navigation': 'تغییر وضعیت منو',
  'Menu': 'منو',
  'Close': 'بستن',
  'by industry': 'بر اساس صنعت',
  'by setting': 'بر اساس فضا و محیط',
  'Email address *': 'آدرس ایمیل *',
  'Name *': 'نام و نام خانوادگی *',
  'Contact form': 'فرم تماس',
  'I consent to Void Acoustics collecting, processing, and storing my information in accordance with their Privacy Policy':
    'با جمع‌آوری، پردازش و ذخیره اطلاعات خود توسط وید اکوستیکس بر اساس سیاست حفظ حریم خصوصی موافقت می‌کنم',
  'I consent to Void Acoustics collecting, processing, and storing my information in accordance with their':
    'با جمع‌آوری، پردازش و ذخیره اطلاعات خود توسط وید اکوستیکس مطابق با',
  'Natural Wood Collection': 'مجموعه چوب طبیعی',
  'Registered WEEE Producer: WEE/EK4517VW': 'تولیدکننده ثبت‌شده تجهیزات الکترونیکی: WEE/EK4517VW',

  // Cookie Notice (Complianz)
  'We use cookies': 'ما از کوکی‌ها استفاده می‌کنیم',
  'Close dialogue': 'بستن پنجره',
  'Functional': 'کاربردی و ضروری',
  'Preferences': 'ترجیحات و شخصی‌سازی',
  'Statistics': 'آماری و تحلیلی',
  'Marketing': 'بازاریابی',
  'Accept': 'پذیرش همه',
  'Reject': 'رد کردن',
  'Manage preferences': 'مدیریت ترجیحات',
  'Always active': 'همیشه فعال',
  'We use necessary cookies to make our site work. We also have performance based and marketing cookies which help us provide you with a personalised browsing experience.':
    'ما از کوکی‌های ضروری برای کارکرد صحیح سایت استفاده می‌کنیم. همچنین از کوکی‌های تحلیلی و بازاریابی برای ارائه بهترین تجربه کاربری شخصی‌سازی‌شده بهره می‌بریم.',
  'The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user.':
    'دسترسی و ذخیره‌سازی فنی صرفاً برای ارائه خدمات درخواست‌شده توسط کاربر یا مشترک کاملاً ضروری است.',
  'The technical storage or access is necessary for the legitimate purpose of storing preferences that are not requested by the subscriber or user.':
    'دسترسی و ذخیره‌سازی فنی برای هدف ذخیره ترجیحات کاربر بدون درخواست صریح به کار می‌رود.',
  'The technical storage or access that is used exclusively for statistical purposes.':
    'دسترسی و ذخیره‌سازی فنی که منحصراً برای اهداف آماری و بهبود عملکرد استفاده می‌شود.',
  'The technical storage or access that is used exclusively for anonymous statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service Provider, or additional records from a third party, information stored or retrieved for this purpose alone cannot usually be used to identify you.':
    'دسترسی و ذخیره‌سازی فنی برای اهداف آماری ناشناس؛ بدون احضاریه قانونی یا اطلاعات تکمیلی ارائه‌دهنده اینترنت، این اطلاعات برای شناسایی هویت شما کافی نیست.',
  'The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes.':
    'ذخیره‌سازی فنی برای ایجاد پروفایل کاربری جهت ارسال تبلیغات هدفمند یا ردیابی در وبسایت‌ها استفاده می‌شود.',

  // Slider & Navigation accessibility labels
  'Go to last slide': 'رفتن به آخرین اسلاید',
  'Next slide': 'اسلاید بعدی',
  'Previous slide': 'اسلاید قبلی',
  'First slide': 'اولین اسلاید',
  'Last slide': 'آخرین اسلاید',
  'Select a slide to show': 'یک اسلاید را برای نمایش انتخاب کنید',
  'Go to page': 'رفتن به صفحه',
  'Page': 'صفحه',

  // Acoustic Features, Audio Specs & Cards
  'Sound Systems': 'سیستم‌های صوتی',
  'Sound System': 'سیستم صوتی',
  'Loudspeakers': 'بلندگوها',
  'Subwoofers': 'ساب‌ووفرها',
  'Line Array': 'بلندگوی خطی (Line Array)',
  'Point Source': 'بلندگوی منبع نقطه‌ای (Point Source)',
  'Surface Mount': 'نصب سطحی و دیواری',
  'Ceiling Speaker': 'بلندگوی سقفی',
  'Ceiling Speakers': 'بلندگوهای سقفی',
  'In-Ceiling': 'توکار سقفی',
  'Pendant': 'آویز',
  'Stage Monitor': 'مانیتور استیج',
  'Stage Monitors': 'مانیتورهای استیج',
  'Column Speaker': 'بلندگوی ستونی',
  'Bass Reflex': 'باس رفلکس',
  'Horn Loaded': 'شیپوری (Horn Loaded)',
  'Coaxial': 'هم‌محور (Coaxial)',
  'Two-way': 'دوراهه (Two-way)',
  'Three-way': 'سه‌راهه (Three-way)',
  'Four-way': 'چهارراهه (Four-way)',
  'Custom RAL colours': 'رنگ‌های سفارشی رال',
  'Custom finishes': 'پوشش‌های سفارشی',
  'Fibreglass': 'فایبرگلاس',
  'Smooth gloss finish': 'پوشش براق و صیقلی',
  'Smooth cellulose finish': 'پوشش مات سلولزی',
  'Textured polyurethane': 'پلی‌یورتان بافت‌دار مقاوم',
  'TourCoat': 'پوشش سخت تورکوت (TourCoat)',

  // Discover & Application sections
  'Nightclubs': 'کلاب‌های شبانه',
  'Live Music': 'موسیقی زنده و کنسرت',
  'Bars & Lounges': 'بارها و سالن‌های لانژ',
  'Dining': 'رستوران‌ها و سالن‌های غذاخوری',
  'Hotels': 'هتل‌ها و ریزورت‌ها',
  'Fitness & Wellness': 'باشگاه‌های ورزشی و اسپا',
  'Retail Stores': 'فروشگاه‌ها و بوتیک‌ها',
  'Houses of Worship': 'مراکز مذهبی و نیایشگاه‌ها',
  'Corporate': 'سالن‌های همایش و شرکتی',
  'Outdoor Venues': 'فضاهای باز و روباز',
  'Cruise Ships & Yachts': 'کشتی‌های تفریحی و یات‌ها',

  // System Design & Consultancy
  'Need help choosing?': 'نیاز به راهنمایی در انتخاب سیستم دارید؟',
  'Speak with our audio consultants to design the perfect sound system for your venue.':
    'با کارشناسان و مهندسان صدای ما برای طراحی بهترین سیستم صوتی متناسب با فضای خود مشورت کنید.',
  'Contact our team': 'تماس با تیم مهندسی ما',
  'Find an installer': 'یافتن نمایندگی و مجری مجاز',
  'Locate a distributor or certified installation partner in your region.':
    'یافتن توزیع‌کننده یا همکار نصب تاییدشده در منطقه و کشور شما.',
  'Find a partner': 'یافتن همکاران و نمایندگان',

  // Downloads & Technical Docs
  'Product Documentation': 'مستندات فنی محصولات',
  'Brochures & Catalogs': 'کاتالوگ‌ها و بروشورها',
  'User Guides & Manuals': 'دفترچه‌ها و راهنماهای کاربری',
  'Spec Sheets': 'برگه‌های مشخصات فنی',
  'CAD Drawings': 'نقشه‌های مهندسی CAD',
  'Preset Files': 'فایل‌های پریست پردازشگر صوتی',
  'Case Studies': 'مطالعات موردی و پروژه‌ها',
  'Latest News': 'آخرین اخبار و رویدادها',
  'Featured Projects': 'پروژه‌های شاخص',

  // Additional Common Strings
  'Featured': 'برگزیده',
  'Trending': 'محبوب‌ترین‌ها',
  'New': 'جدید',
  'Coming Soon': 'به‌زودی',
  'Contact Sales': 'تماس با واحد فروش',
  'Contact Support': 'پشتیبانی فنی',
  'Book a Demo': 'رزرو جلسه تست و دمو',
  'Request a Quote': 'درخواست پیش‌فاکتور و استعلام قیمت',
  'Technical Support': 'پشتیبانی فنی و مهندسی',
  'Warranty & Repairs': 'گارانتی و خدمات پس از فروش',
};

Object.assign(dict, additions);

fs.writeFileSync('tools/full-glossary.json', JSON.stringify(dict, null, 2), 'utf8');
console.log(`Enriched glossary now contains ${Object.keys(dict).length} entries.`);
