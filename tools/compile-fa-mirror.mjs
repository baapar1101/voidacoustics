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

Object.assign(curatedTranslations, {
  // Shared labels and contact details
  'Contact Us | Void Acoustics': 'تماس با ما | وید اکوستیکس',
  'Insights | Case Studies, Blogs, News & Events | Void Acoustics': 'تازه‌های وید | پروژه‌ها، مقالات، اخبار و رویدادها',
  'Resources | Product Documents, Training & Support | Void Acoustics': 'منابع وید | اسناد محصولات، آموزش و پشتیبانی',
  'About Us | Void Acoustics': 'دربارهٔ ما | وید اکوستیکس',
  'Discover | Sound Systems for Every Setting | Void Acoustics': 'کشف کنید | راهکارهای صوتی برای هر فضا | وید اکوستیکس',
  'Sales enquiries, technical support and partnership enquiries for Void Acoustics.': 'ارتباط با واحد فروش، پشتیبانی فنی و همکاری تجاری وید اکوستیکس.',
  'Case studies, blog articles and news from Void Acoustics.': 'پروژه‌ها، مقاله‌ها، اخبار و رویدادهای وید اکوستیکس.',
  'Training videos, product documentation, brochures and technical resources from Void Acoustics.': 'ویدئوهای آموزشی، اسناد محصولات، بروشورها و منابع فنی وید اکوستیکس.',
  'The history, design philosophy and innovation behind Void Acoustics.': 'داستان شکل‌گیری، فلسفهٔ طراحی و نوآوری‌های وید اکوستیکس.',
  'Real-world installations and sound systems across hospitality, entertainment and commercial environments.': 'راهکارها و پروژه‌های واقعی سیستم صوتی برای فضاهای پذیرایی، سرگرمی و تجاری.',
  'Text Image Slides': 'اسلایدهای تصویری',
  'Quotes Slider': 'دیدگاه مشتریان',
  'Contact form': 'فرم تماس',
  'Unit L, The Fulcrum': 'واحد L، ساختمان Fulcrum',
  'Vantage Way': 'خیابان ونتج',
  'Poole, Dorset': 'پول، دورست',
  '© 2026 Void Acoustics Ltd': '© ۲۰۲۶ وید اکوستیکس',

  // Contac
  'Contact Void Acoustics': 'با وید اکوستیکس در تماس باشید',
  'Whether you’re planning a system, need technical support, exploring a partnership, or have a general enquiry, our team is here to help.': 'چه در حال طراحی یک سیستم باشید، چه به پشتیبانی فنی نیاز داشته باشید یا بخواهید دربارهٔ همکاری با ما گفت‌وگو کنید، تیم ما آمادهٔ راهنمایی شماست.',
  'Select the most relevant option below and your enquiry will be directed to the right team, from sales and marketing to technical support and service.': 'موضوع مرتبط را از میان گزینه‌های زیر انتخاب کنید تا درخواست شما مستقیماً به تیم مناسب، از فروش و بازاریابی تا پشتیبانی فنی و خدمات، ارجاع شود.',
  'We aim to respond as quickly as possible, wherever you are in the world.': 'در هر کجای جهان که باشید، تلاش می‌کنیم در کوتاه‌ترین زمان پاسخ‌گوی شما باشیم.',
  'Search by city or postcode': 'جست‌وجو بر اساس شهر یا کد پستی',
  'Dealer': 'فروشنده',
  'Distributor': 'توزیع‌کننده',
  'Integrator': 'مجری سیستم',
  'Search partners': 'جست‌وجوی نمایندگان',
  'Gallery view': 'نمایش فهرستی',
  'Map view': 'نمایش روی نقشه',
  'Results': 'نتایج',
  'No partners found...': 'نماینده‌ای پیدا نشد',
  'The search did not return any partners.': 'برای این محدوده نماینده‌ای پیدا نشد.',
  'Please try again with an alternative search area or contact us': 'محدودهٔ دیگری را جست‌وجو کنید یا با ما تماس بگیرید.',
  'Back to map view': 'بازگشت به نقشه',
  'Explore Departments': 'انتخاب واحد مربوطه',
  'Sales enquiry': 'درخواست فروش',
  'Marketing enquiry': 'درخواست بازاریابی',
  'Become a Void partner': 'درخواست همکاری با وید',
  'Technical support': 'پشتیبانی فنی',
  'Amplifer service request': 'درخواست تعمیر آمپلی‌فایر',
  'Your full name *': 'نام و نام خانوادگی *',
  'Company name *': 'نام شرکت *',
  'Telephone number *': 'شماره تماس *',
  'Country *': 'کشور *',
  'Post/ZIP code *': 'کد پستی *',
  'Enquiry type *': 'موضوع درخواست *',
  'Please select': 'لطفاً انتخاب کنید',
  'Discuss a project or installation': 'مشاوره دربارهٔ پروژه یا نصب',
  'Request product information': 'دریافت اطلاعات محصول',
  'Other': 'سایر موارد',
  'How did you hear about us? *': 'چگونه با ما آشنا شدید؟ *',
  'Heard and seen Void at a venue': 'تجربهٔ محصولات وید در یک مجموعه',
  'Social media': 'شبکه‌های اجتماعی',
  'Online search': 'جست‌وجوی اینترنتی',
  'Tradeshow': 'نمایشگاه تخصصی',
  'Word of mouth': 'معرفی دوستان و همکاران',
  'How can we help? *': 'چطور می‌توانیم کمک کنیم؟ *',
  'Attend a Void Experience': 'حضور در رویداد تجربهٔ وید',
  'Host a Void Experience': 'میزبانی رویداد تجربهٔ وید',
  'Trade shows and exhibitions': 'نمایشگاه‌ها و رویدادهای تخصصی',
  'Collaborations': 'همکاری‌های مشترک',
  'Press and media': 'مطبوعات و رسانه',
  'Social media and content': 'شبکه‌های اجتماعی و تولید محتوا',
  'Feature my case study': 'انتشار پروژهٔ من',
  'Website URL': 'نشانی وب‌سایت',
  'Current brands sold': 'برندهایی که هم‌اکنون عرضه می‌کنید',
  'Number of current employees': 'تعداد کارکنان فعلی',
  'Why do you want to become a Void partner? *': 'چرا مایل به همکاری با وید هستید؟ *',
  'Product model *': 'مدل محصول *',
  'Serial number *': 'شماره سریال *',
  'Billing Information': 'اطلاعات صورتحساب',
  'Address *': 'نشانی *',
  'City *': 'شهر *',
  'Country code *': 'پیش‌شماره کشور *',
  'VAT number': 'شماره مالیات بر ارزش افزوده',
  'Shipping Information': 'اطلاعات ارسال',
  'Device Information': 'اطلاعات دستگاه',
  'Failure description *': 'شرح ایراد *',
  'Power': 'برق و تغذیه',
  'Audio': 'صدا',
  'Mechanics': 'بخش مکانیکی',
  'In-Out': 'ورودی و خروجی',
  'What is the fault with the amplifier? *': 'ایراد آمپلی‌فایر چیست؟ *',
  'Please provide as much detail as possible, including: A detailed description of the fault. Which channel(s) are affected. What product(s) or speaker(s) are connected. Any error messages or warning lights. Whether the fault is constant or intermittent. Any troubleshooting already carried out. Any known cause (e.g. liquid damage, physical damage, power surge or overheating).': 'لطفاً جزئیات کامل را بنویسید: شرح دقیق ایراد، کانال‌های درگیر، محصولات یا بلندگوهای متصل، پیام خطا یا چراغ هشدار، دائمی یا مقطعی بودن مشکل، بررسی‌های انجام‌شده و علت احتمالی مانند نفوذ مایع، آسیب فیزیکی، نوسان برق یا داغ‌شدن.',
  'Find an authorised distributor, dealer or integrator ready to support your upcoming project.': 'نماینده، فروشنده یا مجری رسمی مناسب برای پشتیبانی از پروژهٔ بعدی خود را پیدا کنید.',
  'Join our team of passionate designers, engineers and audio specialists shaping the future of sound.': 'به تیم طراحان، مهندسان و متخصصان صدای ما بپیوندید و در ساخت آیندهٔ صدا سهیم شوید.',
  'View vacancies': 'مشاهده فرصت‌های شغلی',
  'Access product documents, brochures, training and support tools to help you get the most from your system.': 'به اسناد محصولات، بروشورها، آموزش‌ها و ابزارهای پشتیبانی دسترسی پیدا کنید تا بهترین نتیجه را از سیستم خود بگیرید.',
  'Browse resources': 'مشاهده منابع',

  // Insights
  'Stories, projects and events from the world of Void Acoustics': 'داستان‌ها، پروژه‌ها و رویدادهایی از دنیای وید اکوستیکس',
  'Explore the spaces, people and projects shaping Void around the world. From real installations and case studies to product news, event updates and behind-the-scenes stories, this is where we share what we’re building, where we’re being heard and what’s happening next.': 'با فضاها، آدم‌ها و پروژه‌هایی آشنا شوید که حضور وید را در سراسر جهان شکل می‌دهند؛ از پروژه‌های واقعی و مطالعات موردی تا خبر محصولات، رویدادها و روایت‌های پشت صحنه. اینجا جایی است که تازه‌ترین ساخته‌ها، تجربه‌های شنیداری و برنامه‌های آینده را با شما در میان می‌گذاریم.',
  'Explore Void Acoustics Insights': 'در تازه‌های وید جست‌وجو کنید',
  'What are you looking for today?': 'امروز به‌دنبال چه چیزی هستید؟',
  'Clear Search': 'پاک‌کردن جست‌وجو',
  'Explore Insights': 'دسته‌بندی مطالب',
  'All Insights': 'همه مطالب',
  'Blog': 'وبلاگ',
  'News': 'اخبار',
  'Upcoming Events': 'رویدادهای پیش رو',
  'Past Events': 'رویدادهای گذشته',
  'Clear Filters': 'پاک‌کردن فیلترها',
  'Load more': 'نمایش مطالب بیشتر',

  // Resources
  'Access product documentation, brochures, training materials and support tools to help you get the most from your system.': 'اسناد محصولات، بروشورها، محتوای آموزشی و ابزارهای پشتیبانی را یک‌جا در اختیار داشته باشید تا بیشترین بهره را از سیستم خود ببرید.',
  'From specification and installation through to servicing and ongoing use, we’re here to support you.': 'از انتخاب و نصب تا سرویس و استفادهٔ روزمره، همراه شما هستیم.',
  'Select the relevant resources below to find the information, downloads or tools you need.': 'دستهٔ مناسب را انتخاب کنید تا سریع‌تر به اطلاعات، فایل دانلودی یا ابزار مورد نیاز برسید.',
  'All Resources': 'همه منابع',
  'Select Resource': 'انتخاب نوع منبع',
  'Product documents': 'اسناد محصولات',
  'Training videos': 'ویدئوهای آموزشی',
  'Brochures': 'بروشورها',
  'Useful documents': 'اسناد کاربردی',
  'Legacy documents': 'اسناد محصولات قدیمی',
  'Inca Series Tutorials': 'آموزش‌های سری Inca',
  'Bias Series Tutorials': 'آموزش‌های سری Bias',
  'Application Notes': 'راهنماهای کاربردی',
  'Cleaning and Maintenance': 'نظافت و نگهداری',
  'Cleaning and Maintenance Krome': 'نظافت و نگهداری روکش Krome',
  'Bias Patch Panel Setup': 'راه‌اندازی پنل اتصال Bias',
  'Service and Warranty': 'خدمات و گارانتی',
  'Service and Warranty Procedure': 'فرایند خدمات و گارانتی',
  'Certification': 'گواهی‌ها',
  'Simulation Files': 'فایل‌های شبیه‌سازی',
  'Product Overview Brochure': 'بروشور معرفی محصولات',
  'Series Overview Brochure': 'بروشور معرفی سری‌ها',
  'Global Installation Brochure': 'بروشور پروژه‌های جهانی',
  'US Installation Brochure': 'بروشور پروژه‌های آمریکا',
  'Wellbeing Brochure': 'بروشور فضاهای سلامت و تندرستی',
  'Touring Brochure': 'بروشور اجرای زنده و تور',
  'Hotel Brochure': 'بروشور هتل‌ها',
  'Amplifier Comparison Matrix': 'جدول مقایسهٔ آمپلی‌فایرها',
  'Arclite Vertical Fly Bar': 'میلهٔ پرواز عمودی Arclite',

  // Abou
  'About Void Acoustics': 'دربارهٔ وید اکوستیکس',
  'Our history': 'تاریخچهٔ ما',
  'Void Acoustics was never built around the idea of hiding another black box in a room. Our products are designed to be seen, chosen, customised and used in environments where sound, design and atmosphere all matter.': 'وید اکوستیکس از ابتدا برای پنهان‌کردن یک جعبهٔ سیاه دیگر در گوشهٔ فضا ساخته نشد. محصولات ما طوری طراحی می‌شوند که دیده شوند، آگاهانه انتخاب شوند و با هویت هر پروژه هماهنگ باشند؛ در فضاهایی که صدا، طراحی و اتمسفر همگی اهمیت دارند.',
  'From sculpted fibreglass and Natural Wood finishes to the ‘TourCoat’ finish and 25 years of nightlife heritage, Void has been shaped by spaces that demand more from audio.': 'از فرم‌های مجسمه‌وار فایبرگلاس و پرداخت چوب طبیعی تا پوشش مقاوم TourCoat و ۲۵ سال تجربه در فرهنگ شب، وید در فضاهایی رشد کرده است که از صدا انتظاری فراتر دارند.',
  'Void Acoustics team': 'تیم وید اکوستیکس',
  'Void Acoustics Team': 'تیم وید اکوستیکس',
  'Materials from Void Acoustics': 'متریال‌های وید اکوستیکس',
  'Customisation is central to the Void Acoustics approach. Our products can be adapted to suit the space, the brand and the creative direction of the project.': 'سفارشی‌سازی در قلب رویکرد وید اکوستیکس قرار دارد. هر محصول می‌تواند متناسب با فضا، هویت برند و مسیر خلاقانهٔ پروژه تنظیم و تکمیل شود.',
  'Customisation at Void Acoustics': 'سفارشی‌سازی در وید اکوستیکس',
  'That is what gives Void its edge. Loudspeakers that look different, feel personal and have the performance heritage to back them up.': 'همین نگاه، تمایز وید را می‌سازد: بلندگوهایی با ظاهری متفاوت، هویتی شخصی و عملکردی که سال‌ها تجربه پشتوانهٔ آن است.',
  'Raise Tokyo - Nightlife': 'کلاب Raise توکیو',
  'Read case study': 'مطالعهٔ این پروژه',
  '“The Void Acoustics sound system at Spectrum 360 was absolutely unbelievable this year. It felt like the experience reached a whole new level. Just wow.”': '«سیستم صوتی وید اکوستیکس در Spectrum 360 امسال باورنکردنی بود. انگار کل تجربه به سطح تازه‌ای رسیده بود؛ واقعاً شگفت‌انگیز.»',
  'Co Founder and Creative Director, Boomtown Fair': 'هم‌بنیان‌گذار و مدیر خلاقیت Boomtown Fair',
  '“Void Acoustics loudspeakers sound exceptional, and the subwoofers are amazing. During initial sound checks, we turned it up to the max and could hear it a mile away. It was so loud the ground was shaking! I had heard Void before, but not in an outdoor setting. We were blown away by how impressive it sounded.”': '«بلندگوهای وید اکوستیکس صدایی استثنایی دارند و ساب‌ووفرها فوق‌العاده‌اند. در نخستین تست صدا، سیستم را تا آخر بالا بردیم و از فاصله‌ای بسیار دور هم شنیده می‌شد؛ زمین واقعاً می‌لرزید. پیش‌تر وید را شنیده بودم، اما نه در فضای باز. نتیجه فراتر از انتظار ما بود.»',
  'Senior Vice President, Smart Systems USA': 'معاون ارشد Smart Systems آمریکا',
  '“We wanted more than just sound that can be heard. We wanted sound that is high quality and fundamentally different from conventional retail environments. When I walked through Nextopia after the Void Acoustics installation was completed, I was truly impressed.”': '«ما فقط صدایی شنیدنی نمی‌خواستیم؛ کیفیتی بالا و تجربه‌ای متفاوت از فضاهای خرده‌فروشی معمولی می‌خواستیم. وقتی پس از تکمیل نصب وید اکوستیکس در Nextopia قدم زدم، واقعاً تحت تأثیر قرار گرفتم.»',
  'Group CEO, Siam Piwat Thailand': 'مدیرعامل گروه Siam Piwat تایلند',
  '“Having worked with Void Acoustics for many years, they are always innovative and supportive in the drive to improve. The sound quality is unique, iconic, and truly stands out.”': '«پس از سال‌ها همکاری با وید اکوستیکس، همیشه نوآوری و همراهی آن‌ها را در مسیر بهترشدن دیده‌ایم. کیفیت صدا منحصربه‌فرد و شاخص است و واقعاً خود را نشان می‌دهد.»',
  'Technical Manager, Studio 338 London': 'مدیر فنی Studio 338 لندن',
  '“Void takes the sound experience to a completely different level. I clearly remember feeling the different frequencies hitting my body, something I had never experienced before with any other sound system. That was when I knew we had to use Void Acoustics for our festival.”': '«وید تجربهٔ صدا را به سطحی کاملاً متفاوت می‌برد. هنوز برخورد فرکانس‌های مختلف با بدنم را به‌وضوح به یاد دارم؛ حسی که با هیچ سیستم دیگری تجربه نکرده بودم. همان لحظه فهمیدم که جشنوارهٔ ما باید از وید اکوستیکس استفاده کند.»',
  'Organiser, Bazique Festival South Africa': 'برگزارکنندهٔ جشنواره Bazique، آفریقای جنوبی',
  '“From a technical perspective, Void’s products are designed extremely thoroughly with flexible installation methods. The product line is very rich, allowing customers to choose what’s right for different occasions.”': '«از نظر فنی، محصولات وید با دقتی بسیار بالا و روش‌های نصب منعطف طراحی شده‌اند. تنوع محصولات به مشتریان اجازه می‌دهد برای هر کاربرد، انتخاب درستی داشته باشند.»',
  'System Engineer, Real Music Acoustics & Lighting Technology': 'مهندس سیستم، Real Music Acoustics & Lighting Technology',
  '“Void gives us the flexibility to design around architectural demands while still delivering amazing sound. URBNSURF is a flagship venue and we’re proud to have helped shape the experience.”': '«وید به ما انعطاف لازم را می‌دهد تا ضمن پاسخ به نیازهای معماری، صدایی فوق‌العاده ارائه کنیم. URBNSURF مجموعه‌ای شاخص است و افتخار می‌کنیم که در شکل‌دادن تجربهٔ آن سهم داشته‌ایم.»',
  'Co-Owner of Buzz Speaker Hire': 'هم‌مالک Buzz Speaker Hire',
  'From the UK to around the world, Void Acoustics has become synonymous with innovation, artistry and a deep connection to sound, music and people.': 'از بریتانیا تا سراسر جهان، نام وید اکوستیکس با نوآوری، هنر و پیوندی عمیق میان صدا، موسیقی و انسان گره خورده است.',
  'Void Acoustics began in 2002 with a vision to transform the club experience and place sound at the centre of the story. Founders Rog Mogale and Alex Skan sought to create audio systems that could fill any space with immersive sound, energy and emotion.': 'وید اکوستیکس در سال ۲۰۰۲ با چشم‌اندازی برای دگرگون‌کردن تجربهٔ کلاب و قراردادن صدا در مرکز روایت آغاز شد. راگ موگاله و الکس اسکن می‌خواستند سیستم‌هایی بسازند که هر فضا را با صدایی فراگیر، انرژی و احساس پر کند.',
  'What started in Poole in the South of England, with wood-crafted loudspeakers, quickly evolved into a global brand of striking audio solutions that have long transcended their original purpose.': 'کاری که در شهر پول در جنوب انگلستان با بلندگوهای دست‌ساز چوبی آغاز شد، خیلی زود به برندی جهانی با راهکارهای صوتی خیره‌کننده تبدیل شد؛ محصولاتی که مدت‌هاست از کاربرد اولیهٔ خود فراتر رفته‌اند.',
  'Explore history': 'مرور تاریخچهٔ وید',
  'Void Acoustics is built by people who care deeply about sound, design, music and the spaces our products become part of. Many of us are DJs, musicians, engineers and lifelong music lovers. That passion matters.': 'وید اکوستیکس را افرادی می‌سازند که عمیقاً به صدا، طراحی، موسیقی و فضاهایی که محصولات ما بخشی از آن‌ها می‌شوند اهمیت می‌دهند. بسیاری از ما دی‌جی، موسیقی‌دان، مهندس یا دوستدار همیشگی موسیقی هستیم و این اشتیاق در کارمان دیده می‌شود.',
  'We believe the best work happens when people communicate properly, listen to each other and respect different points of view. We challenge ideas, not people. We accept when we are wrong, course-correct when needed and keep moving towards the right outcome.': 'باور داریم بهترین نتیجه زمانی شکل می‌گیرد که درست با هم گفت‌وگو کنیم، به یکدیگر گوش بدهیم و به دیدگاه‌های متفاوت احترام بگذاریم. ایده‌ها را به چالش می‌کشیم، اشتباه را می‌پذیریم و هرجا لازم باشد مسیر را اصلاح می‌کنیم.',
  'There is a strong family spirit at Void, built on respect across the organisation, pride in the work and a shared responsibility to do right by each other, our customers and the venues that trust us.': 'روحیه‌ای خانوادگی در وید جریان دارد که بر احترام، افتخار به کار و مسئولیت مشترک در برابر یکدیگر، مشتریان و مجموعه‌هایی که به ما اعتماد می‌کنند بنا شده است.',
  'The result is a company shaped by teamwork, honesty and a genuine love of music. That is what keeps us moving forward.': 'نتیجه، شرکتی است که با کار تیمی، صداقت و عشق واقعی به موسیقی شکل گرفته؛ نیرویی که ما را رو به جلو می‌برد.',

  // Discover
  'Design-led onboard sound for entertaining, luxury interiors and private living': 'صدای یکپارچه با طراحی برای سرگرمی، فضاهای لوکس و زندگی خصوصی روی آب',
  'Intentional sound that guides attention, supports immersion and respects the space': 'صدایی هدفمند که توجه را هدایت می‌کند، تجربه را فراگیر می‌سازد و به هویت فضا احترام می‌گذارد',
  'Nightlife systems with physical low-end impact and unmistakable visual presence': 'سیستم‌های کلاب با بیس ملموس و حضوری بصری که نمی‌توان نادیده گرفت',
  'Design-led sound for homes that live, entertain and perform beautifully': 'صدایی هماهنگ با معماری برای خانه‌هایی که زندگی، سرگرمی و اجرا را زیبا در کنار هم دارند',
  'Sound that shapes brand identity and makes boutique spaces feel considered': 'صدایی که هویت برند را کامل می‌کند و به فضاهای بوتیک شخصیت می‌بخشد',
  'Controlled audio that moves between calm focus and high-energy performance': 'صدایی کنترل‌شده که از تمرکز آرام تا اجرای پرانرژی همراه فضاست',
  'Outdoor sound for open-air spaces that move from relaxation to celebration': 'صدای فضای باز برای محیط‌هایی که از آرامش روز تا جشن شب تغییر می‌کنند',
  'Sound across the guest journey, from arrival spaces to late-night venues': 'تجربه‌ای صوتی در سراسر مسیر مهمان؛ از لحظهٔ ورود تا فضاهای شبانه',
  'Powerful sound and and impact for immersive events, stages and open-air gatherings': 'صدایی قدرتمند و اثرگذار برای رویدادهای فراگیر، صحنه‌ها و گردهمایی‌های فضای باز',
  'Physical low-end energy and sculpted visual presence built for the booth': 'انرژی ملموس فرکانس‌های پایین و فرمی مجسمه‌وار، ساخته‌شده برای اتاق دی‌جی',
  'Mountain hospitality sound for terraces, chalets and late-night alpine venues': 'صدای حرفه‌ای برای تراس‌ها، کلبه‌ها و مجموعه‌های شبانهٔ کوهستانی',
  'Audio that balances conversation, atmosphere and energy throughout the venue': 'صدایی که در تمام مجموعه میان گفت‌وگو، اتمسفر و انرژی تعادل برقرار می‌کند'
});

Object.assign(glossary, headingTranslations, curatedTranslations);

// Sort dictionary keys by length descending to match longest phrases first if needed
const sortedGlossaryKeys = Object.keys(glossary).sort((a, b) => b.length - a.length);

const LEGACY_PAGE_PATHS = new Map([
  ['/products/nexusseries/nexus6/', '/products/nexus/nexus6/'],
  ['/products/nexusseries/nexusq/', '/products/nexus/nexusq/'],
  ['/products/nexusseries/nexusx/', '/products/nexus/nexusx/'],
  ['/products/venuv2/venu112v2/', '/products/venu/venu112v2/'],
  ['/products/venuv2/venu12v2/', '/products/venu/venu12v2/'],
  ['/products/venuv2/venu14v2/', '/products/venu/venu14v2/'],
  ['/products/venuv2/venu208/', '/products/venu/venu208/'],
  ['/products/venuv2/venu210iv2/', '/products/venu/venu210iv2/'],
  ['/products/venuv2/venu212v2/', '/products/venu/venu212v2/'],
  ['/products/venuv2/venu215v2/', '/products/venu/venu215v2/'],
  ['/products/venuv2/venu6v2/', '/products/venu/venu6v2/'],
  ['/products/venuv2/venu8v2/', '/products/venu/venu8v2/'],
  ['/products/incubusseries/', '/products/incubus/'],
  ['/products/venuv2/', '/products/venu/'],
  ['/cookie-policy/', '/cookies/']
]);

function normalizeLegacyLinks(html) {
  for (const [legacyPath, currentPath] of LEGACY_PAGE_PATHS) {
    html = html.replaceAll(legacyPath, currentPath);
  }
  return html;
}

const ENGLISH_LINK_ASSET_PATH = /^(?:\/wp-(?:content|includes|admin)\/|\/favicon(?:[./]|$)|\/void_fa_logo(?:[._/]|$)|.*\.(?:pdf|zip|dwg|dxf|step|stp|igs|iges|obj|fbx|3ds|skp|jpg|jpeg|png|gif|webp|svg|ico|avif|mp4|webm|mov|mp3|wav|css|js|mjs|json|xml|woff2?|ttf|eot)(?:[?#]|$))/i;

/** Keep page navigation inside the English namespace.
 *
 * The source mirror uses same-site absolute links. The static build later turns
 * those into root-relative links, which used to send English visitors back to
 * the Persian pages. Only page anchors are namespaced; downloads and assets
 * continue to use their shared root paths.
 */
function localizeEnglishAnchorLinks(html) {
  return html.replace(/(<a\b[^>]*?\bhref=)(["'])([^"']*)(\2)/gi, (full, prefix, quote, href) => {
    const value = href.trim();
    if (!value || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(value)) return full;

    let pathWithSuffix;
    if (/^https?:\/\//i.test(value)) {
      try {
        const url = new URL(value);
        if (!/^(?:www\.)?voidacoustics\.com$/i.test(url.hostname)) return full;
        pathWithSuffix = `${url.pathname}${url.search}${url.hash}`;
      } catch {
        return full;
      }
    } else if (value.startsWith('/') && !value.startsWith('//')) {
      pathWithSuffix = value;
    } else {
      return full;
    }

    const pathname = pathWithSuffix.split(/[?#]/, 1)[0];
    if (ENGLISH_LINK_ASSET_PATH.test(pathname) || /^\/en(?:\/|$)/i.test(pathname)) return full;

    const localized = pathname === '/'
      ? `/en/${pathWithSuffix.slice(1)}`
      : `/en${pathWithSuffix}`;
    return `${prefix}${quote}${localized}${quote}`;
  });
}

// Compilation is intentionally repeatable. Once the English mirror contains
// /en/ links, remove that namespace again while generating Persian pages.
function localizePersianAnchorLinks(html) {
  return html.replace(/(<a\b[^>]*?\bhref=)(["'])(\/en(?:\/|(?=[?#]|$))[^"']*)(\2)/gi, (full, prefix, quote, href) => {
    const suffix = href.slice(3);
    const localized = !suffix || suffix === '/'
      ? '/'
      : /^[?#]/.test(suffix) ? `/${suffix}` : suffix;
    return `${prefix}${quote}${localized}${quote}`;
  });
}

const RESOURCE_ASSET_REPLACEMENTS = new Map([
  ['TD10685-2.0-Void-Acoustics-Arclite-Spec-Sheet1.pdf', 'TD10685-2.0-Void-Acoustics-Arclite-Spec-Sheet.pdf'],
  ['UG10589-2-3-Void-Acoustics-Cyclone-Bass-User-Guide-1.pdf', 'UG10589-2.3-Void-Acoustics-Cyclone-Bass-User-Guide-1.pdf'],
  ['UG10607-3.2-Bias-D1-Q1-Q1.5-Q2.pdf', 'UG10607-4-0-Void-Acoustics-Bias-D1-Q1-Q15-Q2-User-Guide.pdf'],
  ['UG10607-3.2-Bias-D1-Q1-Q1.5-Q2-1.pdf', 'UG10607-4-0-Void-Acoustics-Bias-D1-Q1-Q15-Q2-User-Guide.pdf'],
  ['UG10607-3.2-Bias-D1-Q1-Q1.5-Q2-2.pdf', 'UG10607-4-0-Void-Acoustics-Bias-D1-Q1-Q15-Q2-User-Guide.pdf']
]);

function normalizeResourceAssets(html) {
  for (const [oldName, newName] of RESOURCE_ASSET_REPLACEMENTS) {
    html = html.replaceAll(oldName, newName);
  }
  // These two legacy documents are no longer present and have no accurate
  // successor. Remove only their download rows instead of leaving dead links.
  html = html.replace(/<li><a[^>]+href="[^"]*TD10690-1\.0-Bias-Q1\.5-Specification-Sheet\.pdf"[^>]*>[\s\S]*?<\/a><\/li>\s*/gi, '');
  html = html.replace(/<li><a[^>]+href="[^"]*Venu_Series_User_Guide_V1\.0\.pdf"[^>]*>[\s\S]*?<\/a><\/li>\s*/gi, '');
  return html;
}

// Inline Persian Logo SVG for header (fill="currentColor" to adapt to header themes)
const FA_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="56" viewBox="0 0 900 360" fill="none" class="header-fa-logo">
  <path fill="currentColor" d="m 557.57189,302.12 q -16.184,0 -28.084,-2.618 -11.662,-2.38 -22.61,-8.806 l 13.804,-25.942 q 9.758,4.998 18.326,6.902 8.568,2.142 17.85,2.142 13.566,0 20.706,-7.378 7.378,-7.378 7.378,-20.23 V 245 h -23.562 q -25.466,0 -39.27,-14.28 -13.566,-14.518 -13.566,-41.174 0,-20.23 9.758,-34.034 9.996,-14.042 27.132,-21.182 17.136,-7.14 38.794,-7.14 h 36.176 v 118.524 q 0,27.132 -16.422,41.65 -16.422,14.756 -46.41,14.756 z m 27.37,-85.68 v -60.69 h -7.616 q -15.232,0 -23.8,8.568 -8.568,8.568 -8.568,24.276 0,27.846 23.562,27.846 z M 404.06605,245 q -1.19,0 -1.19,-1.19 v -26.418 q 0,-0.952 1.19,-0.952 h 41.65 v -89.25 h 35.462 V 245 Z m 19.278,59.5 q -7.378,0 -11.662,-4.76 -4.284,-4.522 -4.284,-12.376 0,-7.854 4.284,-12.614 4.284,-4.522 11.662,-4.522 7.378,0 11.424,4.522 4.284,4.522 4.284,12.614 0,8.092 -4.284,12.614 -4.284,4.522 -11.424,4.522 z m 40.46,0 q -7.378,0 -11.662,-4.76 -4.284,-4.522 -4.284,-12.376 0,-7.854 4.284,-12.614 4.284,-4.522 11.662,-4.522 7.378,0 11.424,4.522 4.284,4.76 4.284,12.614 0,7.854 -4.284,12.376 -4.284,4.76 -11.424,4.76 z M 270.07591,216.44 h 79.492 q -4.998,-21.896 -11.9,-35.462 -7.14,-13.566 -18.088,-23.324 -10.71,-9.996 -26.418,-16.422 l 13.328,-33.32 q 31.416,12.614 50.456,38.794 19.278,26.18 28.322,69.734 h 31.178 q 1.19,0 1.19,0.952 v 26.418 q 0,1.19 -1.19,1.19 h -146.37 z" style="font-weight:700;font-size:238px;direction:rtl;text-anchor:middle;fill:currentColor" aria-label="وید"/>
</svg>`;

const MOBILE_HEAD_MARKER = /\n?<!-- void-mobile-ui:start -->[\s\S]*?<!-- void-mobile-ui:end -->\n?/gi;

function injectMobileExperience(html, isEnglish) {
  const manifest = isEnglish ? '/manifest-en.webmanifest' : '/manifest-fa.webmanifest';
  const injection = `
<!-- void-mobile-ui:start -->
<meta name="theme-color" content="#070707" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Void Acoustics" />
<link rel="manifest" href="${manifest}" />
<link rel="stylesheet" href="/void-mobile.css?v=20261021-3" />
<script defer src="/void-mobile.js?v=20261021-3"></script>
<!-- void-mobile-ui:end -->
`;
  const clean = html.replace(MOBILE_HEAD_MARKER, '\n');
  return clean.replace(/<\/head>/i, `${injection}</head>`);
}

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
				background:
					radial-gradient(circle at 88% -12%, rgba(255,2,61,.22), transparent 36%),
					linear-gradient(155deg, rgba(16,16,16,.99), rgba(4,4,4,.99)) !important;
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
			html[dir="rtl"] #menu-main-nav::before {
				content: "کاوش در دنیای وید";
				display: flex;
				align-items: center;
				min-height: 44px;
				padding: 0 4px;
				border-bottom: 1px solid rgba(255,255,255,.15);
				color: rgba(255,255,255,.58);
				font-size: .72rem;
				font-weight: 650;
				letter-spacing: 0 !important;
			}
			html[dir="rtl"] #menu-main-nav::after {
				content: "";
				position: absolute;
				top: 21px;
				right: 154px;
				width: 30px;
				height: 2px;
				border-radius: 999px;
				background: var(--void-red);
			}
			html[dir="rtl"] #menu-main-nav > li {
				position: relative !important;
				flex: 0 0 auto !important;
				width: 100% !important;
				border-bottom: 1px solid rgba(255,255,255,.11) !important;
			}
			html[dir="rtl"] #menu-main-nav > li.has-dropdown { position: static !important; }
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
				content: "↗";
				color: var(--void-red);
				font-size: .9rem;
				font-weight: 700;
				line-height: 1;
				opacity: .9;
			}
			html[dir="rtl"] #menu-main-nav > li.has-dropdown > a::after {
				content: "+";
				font-size: 1.35rem;
			}
			html[dir="rtl"] #menu-main-nav > li.has-dropdown > a:active,
			html[dir="rtl"] #menu-main-nav > li.has-dropdown > a:focus-visible {
				color: var(--void-red) !important;
			}
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar { width: 4px; }
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar-track { background: transparent; }
			html[dir="rtl"] #menu-main-nav::-webkit-scrollbar-thumb {
				border-radius: 999px;
				background: rgba(255,255,255,.26);
			}
			html[dir="rtl"] #menu-main-nav > li > a > svg { display: none !important; }
			html[dir="rtl"] #menu-main-nav .menu-dropdown {
				display: block !important;
				position: absolute !important;
				inset: 0 !important;
				width: 100% !important;
				height: 100% !important;
				padding: 0 !important;
				border-radius: 16px !important;
				background: #070707 !important;
				color: #fff !important;
				opacity: 0 !important;
				visibility: hidden !important;
				transform: translateX(-104%) !important;
				transition: transform .42s cubic-bezier(.22,.8,.22,1), opacity .25s ease !important;
				overflow: hidden !important;
				z-index: 60 !important;
			}
			html[dir="rtl"] body.side-menu-open #menu-main-nav > li.has-dropdown.parent-sub-open > .menu-dropdown {
				opacity: 1 !important;
				visibility: visible !important;
				transform: translateX(0) !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown > .page-width,
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner {
				width: 100% !important;
				height: 100% !important;
				max-width: none !important;
				margin: 0 !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner {
				padding: 64px 14px 26px !important;
				border-radius: 16px !important;
				background:
					radial-gradient(circle at 90% 0, rgba(255,2,61,.16), transparent 34%),
					#070707 !important;
				color: #fff !important;
				overflow-x: hidden !important;
				overflow-y: auto !important;
				scrollbar-width: thin;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner > .flex,
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner > .flex > .flex-1 {
				display: block !important;
				width: 100% !important;
				height: auto !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner > .flex > .flex-1 > .flex:first-child {
				position: relative !important;
				z-index: 1 !important;
				width: 100% !important;
				height: auto !important;
				min-height: 100% !important;
				background: transparent !important;
				overflow: visible !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown ul {
				gap: 0 !important;
				padding: 0 !important;
				opacity: 1 !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown li {
				border-bottom: 1px solid rgba(255,255,255,.1);
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown li > a {
				display: flex !important;
				align-items: center !important;
				justify-content: space-between !important;
				min-height: 48px !important;
				padding: 8px 4px !important;
				color: rgba(255,255,255,.9) !important;
				font-size: .94rem !important;
				font-weight: 540 !important;
				line-height: 1.55 !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown li.has-children > a::after {
				content: "+";
				color: var(--void-red);
				font-size: 1.25rem;
			}
			html[dir="rtl"] #menu-main-nav .menu-series-list li.has-children > a svg {
				display: none !important;
			}
			html[dir="rtl"] #menu-main-nav [data-parent-lvl1],
			html[dir="rtl"] #menu-main-nav [data-parent-lvl2] {
				min-height: 48px;
				margin-bottom: 8px;
				padding: 0 4px 12px !important;
				border-bottom: 1px solid rgba(255,255,255,.16);
				color: #fff;
				font-size: 1.05rem;
				font-weight: 750;
			}
			html[dir="rtl"] #menu-main-nav [data-parent-lvl1] a,
			html[dir="rtl"] #menu-main-nav [data-parent-lvl2] a { color: #fff !important; }
			html[dir="rtl"] #menu-main-nav .tracking-eyebrow {
				margin-top: 18px;
				padding: 0 4px 10px !important;
				color: rgba(255,255,255,.5) !important;
				font-size: .68rem !important;
			}
			html[dir="rtl"] #menu-main-nav .mobile-menu-level-3 {
				position: absolute !important;
				inset: 0 !important;
				width: 100% !important;
				height: 100% !important;
				padding: 64px 14px 26px !important;
				border-radius: 16px !important;
				background:
					radial-gradient(circle at 90% 0, rgba(255,2,61,.18), transparent 34%),
					#070707 !important;
				color: #fff !important;
				transform: translateX(-104%) !important;
				overflow-x: hidden !important;
				overflow-y: auto !important;
				z-index: 75 !important;
			}
			html[dir="rtl"] #menu-main-nav .mobile-menu-level-3.mobile-menu-level-3-open {
				transform: translateX(0) !important;
			}
			html[dir="rtl"] #menu-main-nav #products-by-series {
				height: auto !important;
				min-height: 100% !important;
			}
			html[dir="rtl"] body:has(#menu-main-nav > li.parent-sub-open) #menu-main-nav {
				padding-bottom: 0 !important;
				overflow: hidden !important;
			}
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner::-webkit-scrollbar,
			html[dir="rtl"] #menu-main-nav .mobile-menu-level-3::-webkit-scrollbar { width: 4px; }
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner::-webkit-scrollbar-track,
			html[dir="rtl"] #menu-main-nav .mobile-menu-level-3::-webkit-scrollbar-track { background: transparent; }
			html[dir="rtl"] #menu-main-nav .menu-dropdown .menu-dropdown__inner::-webkit-scrollbar-thumb,
			html[dir="rtl"] #menu-main-nav .mobile-menu-level-3::-webkit-scrollbar-thumb {
				border-radius: 999px;
				background: rgba(255,255,255,.24);
			}
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
			html[dir="rtl"] #primary-menu .mobile-menu-back-button {
				position: absolute !important;
				top: 18px !important;
				left: auto !important;
				right: 16px !important;
				display: none !important;
				align-items: center !important;
				justify-content: center !important;
				gap: 7px;
				width: auto !important;
				height: 34px !important;
				padding: 0 12px !important;
				border: 1px solid rgba(255,255,255,.15);
				border-radius: 999px;
				background: rgba(255,255,255,.08);
				color: #fff;
				z-index: 90 !important;
			}
			html[dir="rtl"] #primary-menu .mobile-menu-back-button::after {
				content: "بازگشت";
				font-size: .75rem;
				font-weight: 650;
			}
			html[dir="rtl"] #primary-menu .mobile-menu-back-button svg {
				width: 10px;
				transform: rotate(-90deg) !important;
			}
			html[dir="rtl"] body:has(#menu-main-nav .parent-sub-open) #primary-menu .mobile-menu-back-button,
			html[dir="rtl"] body:has(#menu-main-nav .mobile-menu-level-3-open) #primary-menu .mobile-menu-back-button {
				display: flex !important;
			}
		}

		/* Polished content pages: contact, insights, resources, about and discover. */
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-11,.page-id-13,.page-id-257) main .hero-slider h1 {
			max-width: 18ch;
			font-weight: 850;
			line-height: 1.18;
			text-shadow: 0 3px 24px rgba(0,0,0,.42);
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-11,.page-id-13) main .layout-combine-space .content-component {
			font-size: 1.04rem;
			line-height: 2;
			color: #3e3e3e;
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main [data-tabs] > .lg\\:w-4\\/12 .tabs-mobile-content {
			padding: 1.25rem;
			border: 1px solid #e3e3e3;
			border-radius: 1.25rem;
			background: linear-gradient(145deg,#fafafa 0%,#f1f1f1 100%);
			box-shadow: 0 18px 48px rgba(0,0,0,.06);
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main .departments-list button {
			min-height: 46px;
			text-align: right !important;
			border: 1px solid transparent;
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main .departments-list .item-active > button,
		html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main .departments-list button:hover {
			border-color: rgba(255,2,61,.18);
			background: #fff;
			box-shadow: 0 8px 24px rgba(0,0,0,.055);
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main [data-tabs-content] {
			padding: clamp(1.25rem,3vw,2.5rem);
			border: 1px solid #e7e7e7;
			border-radius: 1.5rem;
			background: #fff;
			box-shadow: 0 22px 62px rgba(0,0,0,.065);
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .form-group label,
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .form-heading {
			display: block;
			margin-bottom: .55rem;
			font-weight: 650;
			text-align: right;
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]),
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 select,
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 textarea {
			width: 100%;
			text-align: right;
			direction: rtl;
			border-radius: .85rem;
			background-color: #fafafa;
			transition: border-color .2s ease,box-shadow .2s ease,background-color .2s ease;
		}
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 input:focus,
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 select:focus,
		html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .wpcf7 textarea:focus {
			outline: none;
			border-color: #ff023d;
			background: #fff;
			box-shadow: 0 0 0 4px rgba(255,2,61,.1);
		}
		html[dir="rtl"] body.page-id-6 main .partner-locator > .bg-surface-200 {
			background:
				radial-gradient(circle at 10% 20%,rgba(255,2,61,.09),transparent 30%),
				#f1f1f1;
		}
		html[dir="rtl"] body.page-id-6 main .partner-checkbox label { margin-right: .45rem; }
		html[dir="rtl"] body.page-id-9 main section.bg-surface-200 {
			background:
				radial-gradient(circle at 88% 18%,rgba(255,2,61,.11),transparent 28%),
				#ededed;
		}
		html[dir="rtl"] body.page-id-9 main [data-insights-search] {
			text-align: right;
			direction: rtl;
		}
		html[dir="rtl"] body.page-id-13 main .accordion-item {
			overflow: hidden;
			border-width: 1px !important;
			border-color: #dedede !important;
			border-radius: 1rem !important;
			background: #fff;
			box-shadow: 0 9px 26px rgba(0,0,0,.04);
		}
		html[dir="rtl"] body.page-id-13 main .accordion-item [data-accordion-toggle] {
			text-align: right;
			background: linear-gradient(100deg,#f1f1f1,#fafafa);
		}
		html[dir="rtl"] body.page-id-13 main .accordion-item a {
			line-height: 1.8;
		}
		html[dir="rtl"] body.page-id-11 main .layout-combine-space img {
			border-radius: 1.25rem;
			box-shadow: 0 24px 60px rgba(0,0,0,.13);
		}
		html[dir="rtl"] body.page-id-11 main .benefits-gradient {
			background:
				radial-gradient(circle at 12% 12%,rgba(255,2,61,.28),transparent 25%),
				linear-gradient(140deg,#050505 0%,#191919 48%,#050505 100%);
		}
		html[dir="rtl"] body.page-id-257 main > section.py-14 .grid > a {
			gap: 0 !important;
			height: 100%;
			overflow: hidden;
			border: 1px solid #e4e4e4;
			border-radius: 1.25rem;
			background: #fff;
			box-shadow: 0 14px 40px rgba(0,0,0,.065);
			transition: transform .28s ease,box-shadow .28s ease,border-color .28s ease;
		}
		html[dir="rtl"] body.page-id-257 main > section.py-14 .grid > a:hover {
			transform: translateY(-6px);
			border-color: rgba(255,2,61,.35);
			box-shadow: 0 24px 58px rgba(0,0,0,.12);
		}
		html[dir="rtl"] body.page-id-257 main > section.py-14 .grid > a > div:last-child {
			min-height: 155px;
			padding: 1.35rem 1.4rem 1.5rem;
			justify-content: flex-start;
		}
		html[dir="rtl"] body.page-id-257 main > section.py-14 .grid > a p {
			color: #5b5b5b;
			font-size: .95rem;
			line-height: 1.85;
		}

		@media (max-width: 959px) {
			html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-11,.page-id-13,.page-id-257) main .hero-slider .page-width {
				padding-top: 7rem !important;
				padding-bottom: 5rem !important;
			}
			html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main .tabs-mobile-container {
				position: relative !important;
				top: auto !important;
			}
			html[dir="rtl"] body:is(.page-id-6,.page-id-9,.page-id-13) main .tabs-mobile-content {
				border-radius: 1rem;
			}
			html[dir="rtl"] body:is(.page-id-6,.page-id-13) main [data-tabs-content] {
				padding: 1.1rem;
				border-radius: 1.1rem;
				box-shadow: 0 12px 34px rgba(0,0,0,.06);
			}
			html[dir="rtl"] body:is(.page-id-6,.page-id-13) main .form-row {
				display: grid !important;
				grid-template-columns: minmax(0,1fr) !important;
				gap: 0 !important;
			}
			html[dir="rtl"] body.page-id-257 main > section.py-14 .grid > a > div:last-child {
				min-height: 0;
			}
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

const technicalLabelRules = [
  [/Firmware Update Guide/gi, 'راهنمای به‌روزرسانی فرم‌ویر'],
  [/Downloading Amplifier Models and Loudspeaker Presets/gi, 'دانلود مدل‌های آمپلی‌فایر و پریست‌های بلندگو'],
  [/Adding Amplifiers to the Workspace/gi, 'افزودن آمپلی‌فایرها به محیط کار'],
  [/Adding Loudspeakers to the Workspace/gi, 'افزودن بلندگوها به محیط کار'],
  [/Amplifier Firmware Upgrade/gi, 'ارتقای فرم‌ویر آمپلی‌فایر'],
  [/Armonia Installation Guide/gi, 'راهنمای نصب Armonia'],
  [/Live View Config Tab/gi, 'تنظیمات نمای زنده'],
  [/Specifications? Sheet/gi, 'برگه مشخصات فنی'],
  [/Specfication Sheet/gi, 'برگه مشخصات فنی'],
  [/User Guide/gi, 'راهنمای کاربر'],
  [/User Manual/gi, 'دفترچه راهنمای کاربر'],
  [/user manual/gi, 'دفترچه راهنمای کاربر'],
  [/Series Manual/gi, 'راهنمای سری'],
  [/\bManual\b/gi, 'دفترچه راهنما'],
  [/Line Drawing/gi, 'نقشهٔ ابعادی'],
  [/3D Model/gi, 'مدل سه‌بعدی'],
  [/Control Software/gi, 'نرم‌افزار کنترل'],
  [/\bSoftware\b/gi, 'نرم‌افزار'],
  [/Preset Library/gi, 'کتابخانهٔ پریست‌ها'],
  [/\bPresets\b/gi, 'پریست‌ها'],
  [/\bFirmware\b/gi, 'فرم‌ویر'],
  [/Comparison Matrix/gi, 'جدول مقایسه'],
  [/Patch Panel Data Sheet/gi, 'دیتاشیت پنل اتصال'],
  [/Patch Panel Setup/gi, 'راه‌اندازی پنل اتصال'],
  [/Ceiling Bracket/gi, 'براکت سقفی'],
  [/Pole Bracket Kit/gi, 'کیت براکت پایه'],
  [/Pole Bracket/gi, 'براکت پایه'],
  [/Stud Bracket/gi, 'براکت پیچی'],
  [/Wall Bracket/gi, 'براکت دیواری'],
  [/Tilt Bracket/gi, 'براکت زاویه‌دار'],
  [/Multi Bracket Extension/gi, 'افزونهٔ براکت چندمنظوره'],
  [/Multi Bracket/gi, 'براکت چندمنظوره'],
  [/Truss Bracket/gi, 'براکت تراس'],
  [/Yoke Bracket/gi, 'براکت یوک'],
  [/Mounting Board/gi, 'صفحهٔ نصب'],
  [/Ground Stack Board/gi, 'صفحهٔ استک زمینی'],
  [/Rigging Assembly/gi, 'مجموعهٔ ریگینگ'],
  [/Fly Frame Flightcase/gi, 'کیس حمل فریم پرواز'],
  [/Fly Frame Extension Bracket Set/gi, 'مجموعه براکت توسعهٔ فریم پرواز'],
  [/Fly Frame/gi, 'فریم پرواز'],
  [/Vertical Fly Bar/gi, 'میلهٔ پرواز عمودی'],
  [/Lift Beam/gi, 'تیر بالابر'],
  [/Flightcase/gi, 'کیس حمل'],
  [/Rack Mount Kit/gi, 'کیت نصب رک'],
  [/Wall\/Desktop Mount Kit/gi, 'کیت نصب دیواری/رومیزی'],
  [/Heavy Duty Top Hat Casting/gi, 'اتصال پایهٔ تقویت‌شده'],
  [/Heavy Duty Top Hat/gi, 'اتصال پایهٔ تقویت‌شده'],
  [/Mounting Bracket/gi, 'براکت نصب'],
  [/USB Drivers/gi, 'درایورهای USB'],
  [/EU Declaration Loudspeakers/gi, 'اظهارنامهٔ اتحادیه اروپا برای بلندگوها'],
  [/UK Declaration Loudspeakers/gi, 'اظهارنامهٔ بریتانیا برای بلندگوها'],
  [/EU Declaration Amplifiers/gi, 'اظهارنامهٔ اتحادیه اروپا برای آمپلی‌فایرها'],
  [/UK Declaration Amplifiers/gi, 'اظهارنامهٔ بریتانیا برای آمپلی‌فایرها'],
  [/Product Brochure/gi, 'بروشور محصولات'],
  [/Series Overview Brochure/gi, 'بروشور معرفی سری‌ها'],
  [/Installations Brochure/gi, 'بروشور پروژه‌ها'],
  [/Installation Brochure/gi, 'بروشور پروژه‌ها'],
  [/Wellbeing Brochure/gi, 'بروشور فضاهای سلامت'],
  [/Touring Brochure/gi, 'بروشور اجرای زنده'],
  [/Hotel Brochure/gi, 'بروشور هتل‌ها'],
  [/Tutorial/gi, 'آموزش'],
  [/Dashboard/gi, 'داشبورد'],
  [/Input/gi, 'ورودی'],
  [/Output/gi, 'خروجی'],
  [/Settings/gi, 'تنظیمات'],
  [/Zones/gi, 'زون‌ها'],
  [/\bPlot\b/gi, 'نمودار'],
  [/\bBlack\b/gi, 'مشکی'],
  [/\bWhite\b/gi, 'سفید'],
  [/Left Handed/gi, 'نسخهٔ چپ'],
  [/Right Handed/gi, 'نسخهٔ راست'],
  [/With Rigging/gi, 'با ریگینگ'],
  [/Without Rigging|w\/o Rigging/gi, 'بدون ریگینگ'],
  [/\bRigging\b/gi, 'ریگینگ'],
  [/\bLeft\b/gi, 'چپ'],
  [/\bRight\b/gi, 'راست']
];

function translateTechnicalLabel(text) {
  if (!text) return text;
  const isTechnicalLabel = /User Guide|User Manual|\bManual\b|Specifications? Sheet|Specfication Sheet|Line Drawing|3D Model|Firmware|Software|Preset|Bracket|Mount|Rigging|Flightcase|Fly Frame|Lift Beam|Top Hat|Declaration|Brochure|Tutorial|\bPlot\b|\bSettings\b|USB Drivers|Comparison Matrix|Data Sheet/i.test(text);
  if (!isTechnicalLabel || text.length > 180) return text;
  let translated = text;
  let changed = false;
  for (const [pattern, replacement] of technicalLabelRules) {
    const next = translated.replace(pattern, replacement);
    if (next !== translated) changed = true;
    translated = next;
  }
  return changed ? translated.replace(/\s+[–-]\s+/g, ' – ') : text;
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
  const technical = translateTechnicalLabel(trimmed);
  if (technical !== trimmed) {
    return text.replace(trimmed, technical);
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
            // Option, checkbox, radio and hidden values are machine-readable
            // identifiers. Translating them breaks filtering and form submits.
            if (attr.name === 'value') {
              const inputType = node.attrs.find((a) => a.name === 'type')?.value?.toLowerCase();
              if (node.nodeName !== 'input' || !['submit', 'button', 'reset'].includes(inputType)) continue;
            }
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
    faHtml = localizePersianAnchorLinks(faHtml);

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
    faHtml = faHtml.replace(/(\/wp-content\/themes\/void2025\/js\/app\.js)(?:\?[^"']*)?/g, '$1?v=20261021-fa5');
    faHtml = normalizeResourceAssets(normalizeLegacyLinks(faHtml));
    faHtml = injectMobileExperience(faHtml, false);

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
    let enHtml = localizeEnglishAnchorLinks(originalHtml);

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
    enHtml = enHtml.replace(/(\/wp-content\/themes\/void2025\/js\/app\.js)(?:\?[^"']*)?/g, '$1?v=20261021-fa5');
    enHtml = normalizeResourceAssets(normalizeLegacyLinks(enHtml));
    enHtml = injectMobileExperience(enHtml, true);

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
