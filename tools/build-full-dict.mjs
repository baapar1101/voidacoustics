import fs from 'node:fs';
import path from 'node:path';

// Load base glossary
import { glossary as baseGlossary } from './audio-glossary.mjs';

const extracted = JSON.parse(fs.readFileSync('tools/extracted-strings.json', 'utf8'));

// Build extended glossary
const fullDict = { ...baseGlossary };

// Let's add all specific product models, series, and descriptions
const productTerms = {
  // Air Series
  'Air 8': 'ایر ۸ (Air 8)',
  'Air 12': 'ایر ۱۲ (Air 12)',
  'Air 15': 'ایر ۱۵ (Air 15)',
  'Airten V3': 'ایرتن وی۳ (Airten V3)',
  'Air Vantage': 'ایر ونتج (Air Vantage)',
  'Air Motion': 'ایر موشن (Air Motion)',
  'Tri Motion': 'ترای موشن (Tri Motion)',
  'Air Stream': 'ایر استریم (Air Stream)',
  'Sub Vantage': 'ساب ونتج (Sub Vantage)',
  'Xair': 'ایکس‌ایر (Xair)',

  // Arcline Series
  'Arcline 8': 'آرکلین ۸ (Arcline 8)',
  'Arcline 118': 'آرکلین ۱۱۸ (Arcline 118)',
  'Arcline 218': 'آرکلین ۲۱۸ (Arcline 218)',
  'Arclite': 'آرکلایت (Arclite)',
  'Arclite 15B': 'آرکلایت ۱۵بی (Arclite 15B)',
  'ArcM 12': 'آرک‌ام ۱۲ (ArcM 12)',
  'ArcM 15': 'آرک‌ام ۱۵ (ArcM 15)',

  // Cirrus Series
  'Cirrus 6.1': 'سیروس ۶.۱ (Cirrus 6.1)',

  // Cyclone Series
  'Cyclone 4': 'سایکلون ۴ (Cyclone 4)',
  'Cyclone 55': 'سایکلون ۵۵ (Cyclone 55)',
  'Cyclone 8': 'سایکلون ۸ (Cyclone 8)',
  'Cyclone 8 V2': 'سایکلون ۸ وی۲ (Cyclone 8 V2)',
  'Cyclone 10': 'سایکلون ۱۰ (Cyclone 10)',
  'Cyclone 208': 'سایکلون ۲۰۸ (Cyclone 208)',
  'Cyclone 208i': 'سایکلون ۲۰۸آی (Cyclone 208i)',
  'Cyclone Bass': 'سایکلون باس (Cyclone Bass)',

  // Incubus System
  'Air Array': 'ایر اَری (Air Array)',
  'Hyperfold': 'هایپرفولد (Hyperfold)',
  'Incubus Sub': 'اینکیوبس ساب (Incubus Sub)',

  // Indigo Series
  'Indigo 6 Pro': 'ایندیگو ۶ پرو (Indigo 6 Pro)',
  'Indigo 6S': 'ایندیگو ۶اس (Indigo 6S)',
  'Indigo Sub': 'ایندیگو ساب (Indigo Sub)',

  // Nexus System
  'Nexus 6': 'نکسوس ۶ (Nexus 6)',
  'Nexus Q': 'نکسوس کیو (Nexus Q)',
  'Nexus X': 'نکسوس ایکس (Nexus X)',
  'Nexus XL': 'نکسوس ایکس‌ال (Nexus XL)',

  // Stasys Series
  'Stasys 118': 'استیسیس ۱۱۸ (Stasys 118)',
  'Stasys 218': 'استیسیس ۲۱۸ (Stasys 218)',
  'Stasys X V2': 'استیسیس ایکس وی۲ (Stasys X V2)',

  // Venu Series
  'Venu 6 V2': 'ونو ۶ وی۲ (Venu 6 V2)',
  'Venu 8 V2': 'ونو ۸ وی۲ (Venu 8 V2)',
  'Venu 10 V2': 'ونو ۱۰ وی۲ (Venu 10 V2)',
  'Venu 12 V2': 'ونو ۱۲ وی۲ (Venu 12 V2)',
  'Venu 14 V2': 'ونو ۱۴ وی۲ (Venu 14 V2)',
  'Venu 15 V2': 'ونو ۱۵ وی۲ (Venu 15 V2)',
  'Venu 208': 'ونو ۲۰۸ (Venu 208)',
  'Venu 208i': 'ونو ۲۰۸آی (Venu 208i)',
  'Venu 210i V2': 'ونو ۲۱۰آی وی۲ (Venu 210i V2)',
  'Venu 112 V2': 'ونو ۱۱۲ وی۲ (Venu 112 V2)',
  'Venu 115 V2': 'ونو ۱۱۵ وی۲ (Venu 115 V2)',
  'Venu 118 V2': 'ونو ۱۱۸ وی۲ (Venu 118 V2)',
  'Venu 212 V2': 'ونو ۲۱۲ وی۲ (Venu 212 V2)',
  'Venu 215 V2': 'ونو ۲۱۵ وی۲ (Venu 215 V2)',
  'Venu 215i V2': 'ونو ۲۱۵آی وی۲ (Venu 215i V2)',
  'Venu 218 V2': 'ونو ۲۱۸ وی۲ (Venu 218 V2)',

  // Amplifiers
  'Bias Q1+': 'بایاس کیو۱+ (Bias Q1+)',
  'Bias Q1.5+': 'بایاس کیو۱.۵+ (Bias Q1.5+)',
  'Bias Q2+': 'بایاس کیو۲+ (Bias Q2+)',
  'Bias Q3': 'بایاس کیو۳ (Bias Q3)',
  'Bias Q5': 'بایاس کیو۵ (Bias Q5)',
  'Inca 500': 'اینکا ۵۰۰ (Inca 500)',
  'Inca 1000': 'اینکا ۱۰۰۰ (Inca 1000)',
  'Inca 2000': 'اینکا ۲۰۰۰ (Inca 2000)',
};

Object.assign(fullDict, productTerms);

// Paragraphs, taglines, philosophy
const philosophyDict = {
  'Design-led professional loudspeakers, subwoofers and amplification for hospitality, entertainment and commercial environments.':
    'بلندگوها، ساب‌ووفرها و آمپلی‌فایرهای حرفه‌ای و پیشگام در طراحی برای فضاهای پذیرایی، هتل‌داری، سرگرمی و محیط‌های تجاری لوکس.',

  'Professional Loudspeakers & Sound Systems | Void Acoustics':
    'بلندگوها و سیستم‌های صوتی حرفه‌ای | وید اکوستیکس',

  'Professional Loudspeakers &amp; Sound Systems | Void Acoustics':
    'بلندگوها و سیستم‌های صوتی حرفه‌ای | وید اکوستیکس',

  'Professional Loudspeakers & Sound Systems Void Acoustics':
    'بلندگوها و سیستم‌های صوتی حرفه‌ای وید اکوستیکس',

  'Void Acoustics loudspeakers are crafted differently. Our sculpted fibreglass enclosures allow us to create curved, iconic forms that move away from the standard rectangular box. The result is a product language that is instantly recognisable and visually distinctive.':
    'بلندگوهای وید اکوستیکس کاملاً متمایز ساخته می‌شوند. بدنه‌های تراش‌خورده و منحنی از جنس فایبرگلاس به ما امکان می‌دهند فرم‌های نمادین و چشم‌نوازی خلق کنیم که فراتر از جعبه‌های مستطیلی استاندارد هستند. نتیجه، زبانی از محصول است که فوراً قابل تشخیص و از نظر بصری بی‌همتاست.',

  'Alongside fibreglass, we work with Natural Wood finishes for material-led interiors, listening bars and high-end hospitality spaces where the loudspeaker needs to sit comfortably alongside furniture, lighting and architecture. For event and demanding touring use, the ‘TourCoat’ finish is engineered to withstand repeated handling, transport and the demands of real-world operation.':
    'در کنار فایبرگلاس، ما از روکش‌های چوب طبیعی برای دکوراسیون‌های مدرن، لیسنینگ‌بارها و فضاهای پذیرایی لوکس استفاده می‌کنیم؛ جایی که سیستم صوتی باید در هماهنگی کامل با مبلمان، نورپردازی و معماری قرار گیرد. همچنین برای اجرای زنده و تورهای فشرده، روکش مقاوم «تورکوت» مهندسی شده تا در برابر حمل‌ونقل مداوم و شرایط سخت اجرا دوام آورد.',

  'Colour-matched fibreglass enclosures, custom grille finishes, metallic KROME effects, alternative logo colours, visible internal bracing details or Natural Wood options for a more refined, hi-fi-inspired aesthetic. Whether the aim is to blend into the interior or create a statement feature, Void gives designers, venue owners, rental companies and integrators more freedom than a standard loudspeaker system would normally allow.':
    'بدنه‌های فایبرگلاس با تطبیق رنگ سفارشی، توری‌های اختصاصی، جلوه‌های متالیک کروم، رنگ‌های متنوع لوگو، جزئیات تقویتی داخلی یا چوب طبیعی با زیبایی‌شناسی سیستم‌های صوتی های-فای. چه هدف همگام‌سازی با معماری داخلی باشد چه خلق یک اثر هنری خیره‌کننده، وید به طراحان، مالکان مجموعه‌ها و مهندسان صدا آزادی عملی بی‌نظیر می‌بخشد.',

  'Void Acoustics’ heritage is in nightclubs, and that matters. These are some of the most demanding audio environments in the world: hot rooms, long operating hours, high output, physical low-end pressure and systems pushed night after night by DJs, venues and audiences.':
    'اصالت و پیشینه وید اکوستیکس در کلاب‌های شبانه نهفته است، و این نقشی حیاتی دارد. این‌ها چالش‌برانگیزترین محیط‌های صوتی دنیا هستند: محیط‌های گرم، ساعات کار مداوم، خروجی صوتی فوق‌العاده بالا، فشار فیزیکی بیس‌های کوبنده، و سیستم‌هایی که شب پس از شب توسط دی‌جی‌ها و مخاطبان به اوج کشیده می‌شوند.',

  'For over 25 years, Void systems have been trusted in clubs, outdoor venues, beach bars, poolside spaces, ski resorts, festivals and destination nightlife environments around the world. We have not appeared overnight, and we have not built our reputation in theory. Our products have been shaped by real venues, real installers and real dancefloors.':
    'برای بیش از ۲۵ سال، سیستم‌های وید در مشهورترین کلاب‌ها، سالن‌های روباز، بیچ‌بارها، استخرها، ریزورت‌های اسکی، فستیوال‌ها و مقاصد شبانه برتر جهان مورد اعتماد بوده‌اند. ما یک‌شبه به وجود نیامده‌ایم و اعتبارمان را روی کاغذ نساخته‌ایم؛ محصولات ما در سالن‌های واقعی، با نصب‌کنندگان واقعی و در پیست‌های رقص پرشور شکل گرفته‌اند.',

  'Every project deserves careful consideration to achieve the best possible performance. Loudspeaker and amplifier selection, placement, coverage and tuning all play a critical role in the final result. Our team can help you define the right solution, support system design and deliver the best outcome for your client.':
    'هر پروژه شایسته بررسی دقیق است تا به بالاترین کیفیت عملکرد دست یابد. انتخاب بلندگو و آمپلی‌فایر، جانمایی، زاویه پوشش و تیونینگ نهایی نقشی کلیدی در نتیجه کار ایفا می‌کنند. تیم متخصص ما آماده است تا راهکار ایده‌آل را به شما پیشنهاد دهد، از طراحی سیستم پشتیبانی کند و بهترین نتیجه را برای شما و مشتریتان به ارمغان آورد.',

  'We do not simply manufacture loudspeakers. We understand how products, rooms and people interact. A great system should deliver even coverage, full-range sound, controlled low-end energy, reduced listener fatigue and reliable performance day after day.':
    'ما تنها سازنده بلندگو نیستیم؛ ما تعامل عمیق میان محصولات صوتی، فضا و انسان را درک می‌کنیم. یک سیستم صوتی عالی باید پوششی یکنواخت، صدایی با دامنه کامل، انرژی کنترل‌شده در فرکانس‌های بم، عدم خستگی گوش شنونده، و عملکردی پایدار و قابل‌اطمینان را در تمام طول روز به نمایش بگذارد.',

  'The right system supports conversation, builds atmosphere and keeps energy consistent across the venue. From dining areas and bars to lounges, terraces and private rooms, Void Acoustics systems deliver controlled coverage, considered aesthetics and reliable performance in spaces where every detail shapes the guest experience.':
    'سیستم صوتی مناسب، گفتگوهای دلپذیر را تقویت می‌کند، اتمسفر فضا را می‌سازد و انرژی سالن را پیوسته حفظ می‌کند. از سالن‌های غذاخوری و بارها گرفته تا لانژها، تراس‌ها و اتاق‌های خصوصی، سیستم‌های وید اکوستیکس با پوشش صوتی کنترل‌شده، زیبایی خیره‌کننده و عملکردی ماندگار، تجربه‌ای فراموش‌نشدنی خلق می‌کنند.',

  'Void Acoustics DJ monitoring systems are used by premium venues, touring DJs and music-led spaces where the booth is part of the show. Sculpted fibreglass enclosures, high-output performance and physical low-end energy give DJs the clarity and impact they need while creating a booth that looks as powerful as it sounds.':
    'سیستم‌های مانیتورینگ دی‌جی وید اکوستیکس در برترین مجموعه‌ها، توسط دی‌جی‌های بین‌المللی و در فضاهایی استفاده می‌شوند که جایگاه دی‌جی بخشی از شکوه اجراست. بدنه‌های فایبرگلاس مجسمه‌وار، خروجی قدرتمند و انرژی ملموس بیس، وضوح و هیجانی را که دی‌جی به آن نیاز دارد فراهم می‌کنند و جایگاهی پدید می‌آورند که ابهتش هم‌تراز با صدای آن است.',

  'Luxury fashion and lifestyle spaces now feel closer to hospitality than traditional stores. The environment needs to feel as considered as the products on display.':
    'بوتیک‌ها و فضاهای مد و لایف‌استایل لوکس امروزه بیش از فروشگاه‌های سنتی، شبیه به فضاهای پذیرایی مجلل هستند. محیط صوتی باید به همان اندازه کالاهای به نمایش درآمده باظرافت و هوشمندانه باشد.',

  'Void Acoustics systems bring club-quality sound into boutique settings at controlled levels, shaping the customer journey without overpowering it. With design-led loudspeakers that can complement the interior or become part of the brand language, sound helps create spaces people stay in, spend in and remember.':
    'سیستم‌های وید اکوستیکس کیفیت صدای برتر کلاب‌ها را با ترازهای صوتی کنترل‌شده به فضاهای بوتیک می‌آورند؛ سفری جذاب برای خریدار می‌سازند بدون آنکه مکالمات را مختل کنند. با بلندگوهایی پیشرو در طراحی که با دکوراسیون آمیخته یا به نماد برند بدل می‌شوند، صدا محیطی خلق می‌کند که افراد در آن بیشتر می‌مانند و آن را به خاطر می‌سپارند.',

  'Design-led audio for pop-ups, showrooms and product showcases where the space is built to express the brand, not just display products.':
    'صدایی پیشگام در طراحی برای پاپ‌آپ‌ها، شو‌روم‌ها و نمایشگاه‌های محصول؛ جایی که فضا نه تنها برای نمایش کالا، بلکه برای بازتاب هویت و شکوه برند خلق شده است.',

  'Powerful sound and impact for immersive events, stages and open-air gatherings.':
    'صدای پرقدرت و کوبنده برای رویدادهای غوطه‌ورکننده، صحنه‌های اجرا و گردهمایی‌های باشکوه در فضای باز.',

  'An introduction to sound system design and the principles behind great sound.':
    'مقدمه‌ای جامع بر طراحی سیستم‌های صوتی و اصول علمی و مهندسی دستیابی به صدایی استثنایی.',

  'Custom RAL colour finishes for selected Void Acoustics products.':
    'پوشش‌های رنگ سفارشی رال (RAL) برای محصولات برگزیده وید اکوستیکس.',

  'Training videos, product documentation, brochures and technical resources from Void Acoustics.':
    'ویدیوهای آموزشی، مستندات فنی محصولات، کاتالوگ‌ها و منابع مهندسی وید اکوستیکس.',

  'Terms and conditions for using the Void Acoustics website and services.':
    'شرایط و قوانین استفاده از وبسایت و خدمات وید اکوستیکس.',
};

Object.assign(fullDict, philosophyDict);

// Save to tools/full-glossary.json
fs.writeFileSync('tools/full-glossary.json', JSON.stringify(fullDict, null, 2), 'utf8');
console.log(`Saved full glossary with ${Object.keys(fullDict).length} terms and sentences.`);
