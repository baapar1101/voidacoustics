import fs from 'node:fs';

const pages = JSON.parse(fs.readFileSync('tools/all-pages-meta.json', 'utf8'));
const dict = JSON.parse(fs.readFileSync('tools/full-glossary.json', 'utf8'));

// Common rules for page titles
// "Air Motion | High Output Bi-Amp Loudspeaker | Void Acoustics" -> "ایر موشن | بلندگوی بای‌امپ پرقدرت | وید اکوستیکس"
for (const p of pages) {
  if (p.title) {
    let t = p.title.trim();
    if (!dict[t]) {
      let faTitle = t;
      // Replace brand suffix
      faTitle = faTitle.replace(/\|\s*Void Acoustics$/i, '| وید اکوستیکس');
      faTitle = faTitle.replace(/Void Acoustics/g, 'وید اکوستیکس');
      faTitle = faTitle.replace(/Loudspeakers & Sound Systems/gi, 'بلندگوها و سیستم‌های صوتی');
      faTitle = faTitle.replace(/Loudspeakers &amp; Sound Systems/gi, 'بلندگوها و سیستم‌های صوتی');
      faTitle = faTitle.replace(/Sound Systems/gi, 'سیستم‌های صوتی');
      faTitle = faTitle.replace(/Loudspeakers/gi, 'بلندگوها');
      faTitle = faTitle.replace(/Subwoofers/gi, 'ساب‌ووفرها');
      faTitle = faTitle.replace(/Amplifiers/gi, 'آمپلی‌فایرها');
      faTitle = faTitle.replace(/Products/gi, 'محصولات');
      faTitle = faTitle.replace(/Resources/gi, 'منابع و مستندات');
      faTitle = faTitle.replace(/Insights/gi, 'پروژه‌ها و بینش‌ها');
      faTitle = faTitle.replace(/About Us/gi, 'درباره ما');
      faTitle = faTitle.replace(/About/gi, 'درباره ما');
      faTitle = faTitle.replace(/Contact Us/gi, 'تماس با ما');
      faTitle = faTitle.replace(/Contact/gi, 'تماس با ما');
      faTitle = faTitle.replace(/Partner Locator/gi, 'یافتن نمایندگی‌ها');
      faTitle = faTitle.replace(/Understanding Sound Systems/gi, 'آشنایی با سیستم‌های صوتی');
      faTitle = faTitle.replace(/RAL Colours/gi, 'رنگ‌های سفارشی رال (RAL)');
      faTitle = faTitle.replace(/Customisation/gi, 'سفارشی‌سازی');
      faTitle = faTitle.replace(/Natural Wood/gi, 'چوب طبیعی');
      faTitle = faTitle.replace(/Interior Design/gi, 'طراحی داخلی');
      faTitle = faTitle.replace(/Careers/gi, 'فرصت‌های شغلی');
      faTitle = faTitle.replace(/Cookies/gi, 'کوکی‌ها');
      faTitle = faTitle.replace(/Privacy Policy/gi, 'سیاست حریم خصوصی');
      faTitle = faTitle.replace(/Terms & Conditions/gi, 'شرایط و قوانین');
      faTitle = faTitle.replace(/Terms &amp; Conditions/gi, 'شرایط و قوانین');

      // Product Series in title
      faTitle = faTitle.replace(/\bAir Series\b/g, 'سری Air');
      faTitle = faTitle.replace(/\bArcline Series\b/g, 'سری Arcline');
      faTitle = faTitle.replace(/\bCirrus Series\b/g, 'سری Cirrus');
      faTitle = faTitle.replace(/\bCyclone Series\b/g, 'سری Cyclone');
      faTitle = faTitle.replace(/\bIncubus System\b/g, 'سیستم Incubus');
      faTitle = faTitle.replace(/\bIndigo Series\b/g, 'سری Indigo');
      faTitle = faTitle.replace(/\bNexus System\b/g, 'سیستم Nexus');
      faTitle = faTitle.replace(/\bStasys Series\b/g, 'سری Stasys');
      faTitle = faTitle.replace(/\bVenu Series\b/g, 'سری Venu');

      dict[t] = faTitle;
    }
  }

  if (p.desc) {
    let d = p.desc.trim();
    if (!dict[d]) {
      let faDesc = d;
      faDesc = faDesc.replace(/Void Acoustics/g, 'وید اکوستیکس');
      faDesc = faDesc.replace(/loudspeakers/gi, 'بلندگوها');
      faDesc = faDesc.replace(/loudspeaker/gi, 'بلندگو');
      faDesc = faDesc.replace(/subwoofers/gi, 'ساب‌ووفرها');
      faDesc = faDesc.replace(/subwoofer/gi, 'ساب‌ووفر');
      faDesc = faDesc.replace(/amplifiers/gi, 'آمپلی‌فایرها');
      faDesc = faDesc.replace(/amplification/gi, 'تقویت‌کننده‌ها');
      faDesc = faDesc.replace(/sound systems/gi, 'سیستم‌های صوتی');
      faDesc = faDesc.replace(/sound system/gi, 'سیستم صوتی');
      faDesc = faDesc.replace(/professional/gi, 'حرفه‌ای');
      faDesc = faDesc.replace(/hospitality/gi, 'فضاهای پذیرایی و هتل‌داری');
      faDesc = faDesc.replace(/entertainment/gi, 'مراکز سرگرمی');
      faDesc = faDesc.replace(/commercial environments/gi, 'محیط‌های تجاری');
      faDesc = faDesc.replace(/commercial/gi, 'تجاری');
      faDesc = faDesc.replace(/nightclubs/gi, 'کلاب‌های شبانه');
      faDesc = faDesc.replace(/nightclub/gi, 'کلاب شبانه');
      faDesc = faDesc.replace(/bars and restaurants/gi, 'بارها و رستوران‌ها');
      faDesc = faDesc.replace(/high-performance/gi, 'فوق‌پیشرفته با راندمان بالا');
      faDesc = faDesc.replace(/high performance/gi, 'عملکرد بالا');
      faDesc = faDesc.replace(/low-frequency/gi, 'فرکانس پایین (بیس)');

      dict[d] = faDesc;
    }
  }
}

fs.writeFileSync('tools/full-glossary.json', JSON.stringify(dict, null, 2), 'utf8');
console.log(`Updated glossary with all page meta. Total: ${Object.keys(dict).length}`);
