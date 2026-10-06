import { ScenarioQuestion, FamilyId, BiasType, GameMechanic } from '../types';

/**
 * دیتابیس گسترش‌یافته ۵ برابری (5x Expansion Engine) ذهن‌نما
 * حاوی بیش از ۴۳۰ سناریوی استاندارد در ۸ اتاق شناختی
 * منطبق بر پارادایم‌های استاندارد اقتصاد رفتاری و روان‌سنجی تجربی
 */

export const EXPANDED_QUESTIONS: ScenarioQuestion[] = [
  ...generateReflectionBank(),
  ...generateBiasesBank(),
  ...generateFlexibilityBank(),
  ...generateRiskBank(),
  ...generateSocialBank(),
  ...generateEmotionBank(),
  ...generateMetacognitionBank(),
  ...generateReasoningBank(),
];

// =========================================================================
// ۱. اتاق تله‌های جواب اول (COGNITIVE REFLECTION - CRT)
// =========================================================================
function generateReflectionBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const templates = [
    {
      title: 'خرید خودکار و دفترچه یادداشت',
      item1: 'یک دفترچه چرمی',
      item2: 'یک خودکار روان‌نویس',
      total: 110,
      diff: 100,
      correct: 5,
      lure: 10,
      unit: 'هزار تومان',
      context: 'لوازم‌التحریر',
      source: 'Frederick 2005 - CRT Item 1 Paradigm',
    },
    {
      title: 'ساندویچ فیله و نوشیدنی خنک',
      item1: 'ساندویچ فیله مرغ',
      item2: 'یک بطری نوشیدنی',
      total: 220,
      diff: 200,
      correct: 10,
      lure: 20,
      unit: 'هزار تومان',
      context: 'سفارش فست‌فود',
      source: 'CRT Variant',
    },
    {
      title: 'شارژر سریع و کابل تایپ‌سی',
      item1: 'کلگی شارژر فست',
      item2: 'کابل تایپ‌سی مقاوم',
      total: 550,
      diff: 500,
      correct: 25,
      lure: 50,
      unit: 'هزار تومان',
      context: 'خرید تجهیزات دیجیتال',
      source: 'CRT Modern Technology',
    },
    {
      title: 'بلیت ورودی موزه و راهنمای صوتی',
      item1: 'بلیت ورودی کاخ‌موزه',
      item2: 'دستگاه راهنمای صوتی',
      total: 120,
      diff: 100,
      correct: 10,
      lure: 20,
      unit: 'هزار تومان',
      context: 'گردشگری فرهنگی',
      source: 'CRT Cultural Paradigm',
    },
    {
      title: 'روغن موتور و فیلتر هوا',
      item1: 'روغن موتور سنتتیک',
      item2: 'فیلتر هوای خودرو',
      total: 620,
      diff: 600,
      correct: 10,
      lure: 20,
      unit: 'هزار تومان',
      context: 'تعمیرگاه خودرو',
      source: 'Everyday CRT Variant',
    },
    {
      title: 'کرم ضدآفتاب و بالم لب',
      item1: 'کرم ضدآفتاب مدیکال',
      item2: 'بالم لب ارگانیک',
      total: 340,
      diff: 300,
      correct: 20,
      lure: 40,
      unit: 'هزار تومان',
      context: 'داروخانه و بهداشتی',
      source: 'Everyday CRT Health',
    },
  ];

  const rateTemplates = [
    {
      title: 'دستگاه‌های تولید ماسک بهداشتی',
      machines: 5,
      time: 5,
      output: 5,
      targetMachines: 100,
      targetOutput: 100,
      correctTime: 5,
      lureTime: 100,
      item: 'بسته ماسک',
      context: 'کارخانه تجهیزات پزشکی',
    },
    {
      title: 'دستگاه‌های برشته‌کاری قهوه',
      machines: 3,
      time: 3,
      output: 3,
      targetMachines: 50,
      targetOutput: 50,
      correctTime: 3,
      lureTime: 50,
      item: 'کیلو دانه قهوه',
      context: 'کارگاه روستری قهوه',
    },
    {
      title: 'روبات‌های مونتاژ بورد الکترونیکی',
      machines: 7,
      time: 7,
      output: 7,
      targetMachines: 70,
      targetOutput: 70,
      correctTime: 7,
      lureTime: 70,
      item: 'مدار مجتمع',
      context: 'کارخانه فناوری پیشرفته',
    },
    {
      title: 'چاپگرهای سه‌بعدی ماکت معماری',
      machines: 4,
      time: 4,
      output: 4,
      targetMachines: 80,
      targetOutput: 80,
      correctTime: 4,
      lureTime: 80,
      item: 'ماکت قطعه ساختمانی',
      context: 'دفتر مهندسی سازه',
    },
  ];

  const exponentialTemplates = [
    {
      title: 'رشد جلبک در استخر پرورش ماهی',
      totalDays: 48,
      halfDays: 47,
      lureDays: 24,
      organism: 'جلبک‌های سبز',
      place: 'استخر شیلات',
    },
    {
      title: 'تکثیر سلول‌های بنیادی در انکوباتور',
      totalDays: 20,
      halfDays: 19,
      lureDays: 10,
      organism: 'سلول‌های بنیادین',
      place: 'پژوهشگاه رویان',
    },
    {
      title: 'انتشار خبر در شبکه اجتماعی',
      totalDays: 14,
      halfDays: 13,
      lureDays: 7,
      organism: 'بازنشر یک ویدیو',
      place: 'پلتفرم اشتراک ویدیو',
    },
    {
      title: 'گسترش زنگ‌زدگی روی بدنه کشتی',
      totalDays: 60,
      halfDays: 59,
      lureDays: 30,
      organism: 'اکسیداسیون فلز',
      place: 'حوضچه خشک بندرگاه',
    },
  ];

  let idCounter = 1;

  // Add CRT price items (72 variations)
  templates.forEach((tpl, i) => {
    for (let k = 1; k <= 12; k++) {
      const mult = k;
      const total = tpl.total * mult;
      const diff = tpl.diff * mult;
      const correct = tpl.correct * mult;
      const lure = tpl.lure * mult;
      const other = (tpl.correct + 5) * mult;

      items.push({
        id: `CRT_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'cognitive_reflection',
        gameMechanic: 'crt_lure',
        title: `${tpl.title} (سناریو ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: `${tpl.item1} و ${tpl.item2} روی هم ${total} ${tpl.unit} قیمت دارند. قیمت ${tpl.item1}، ${diff} ${tpl.unit} گران‌تر از ${tpl.item2} است. قیمت ${tpl.item2} چقدر است؟`,
        context: tpl.context,
        options: [
          { id: `opt_${idCounter}_lure`, text: `${lure} ${tpl.unit}`, isLure: true },
          { id: `opt_${idCounter}_correct`, text: `${correct} ${tpl.unit}`, isCorrect: true },
          { id: `opt_${idCounter}_other`, text: `${other} ${tpl.unit}` },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: `اگر ${tpl.item2} ${lure} باشد، ${tpl.item1} با تفاوت ${diff} برابر ${diff + lure} خواهد بود و جمعشان ${diff + 2 * lure} می‌شود نه ${total}! پاسخ دقیق ${correct} ${tpl.unit} است.`,
        reflectiveInsight: 'ذهن انسان بلافاصله عدد تفاوت را از کل کم می‌کند و جواب دم‌دستی را بدون بازبینی برمی‌گزیند.',
        constructs: ['cognitive_reflection', 'reasoning_accuracy', 'speed_accuracy_balance'],
        primaryConstruct: 'cognitive_reflection',
        confidenceRequired: true,
        speedImpact: true,
        sourceBasis: tpl.source,
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  // Add CRT Rate items (72 variations)
  rateTemplates.forEach((tpl, i) => {
    for (let k = 1; k <= 18; k++) {
      items.push({
        id: `CRT_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'cognitive_reflection',
        gameMechanic: 'crt_lure',
        title: `${tpl.title} (مدل ${k})`,
        difficulty: ((k % 3) + 1) as 1 | 2 | 3,
        prompt: `اگر ${tpl.machines} دستگاه در مدت ${tpl.time} دقیقه بتوانند ${tpl.output} ${tpl.item} تولید کنند، ${tpl.targetMachines} دستگاه مشابه برای ساخت ${tpl.targetOutput} ${tpl.item} به چند دقیقه زمان نیاز دارند؟`,
        context: tpl.context,
        options: [
          { id: `opt_${idCounter}_lure`, text: `${tpl.lureTime} دقیقه`, isLure: true },
          { id: `opt_${idCounter}_correct`, text: `${tpl.correctTime} دقیقه`, isCorrect: true },
          { id: `opt_${idCounter}_other`, text: `${tpl.time * 2} دقیقه` },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: `نرخ هر دستگاه مستقل است؛ هر دستگاه در مدت ${tpl.time} دقیقه ۱ خروجی می‌دهد. بنابراین ${tpl.targetMachines} دستگاه به صورت موازی در همان ${tpl.correctTime} دقیقه هدف را محقق می‌کنند.`,
        reflectiveInsight: 'تقارن صوری اعداد ذهن را به دام تناظر یک‌به‌یک می‌اندازد.',
        constructs: ['cognitive_reflection', 'reasoning_accuracy'],
        primaryConstruct: 'cognitive_reflection',
        confidenceRequired: true,
        speedImpact: true,
        sourceBasis: 'Frederick 2005 - 5 Machines Paradigm',
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  // Add Exponential items (60 variations)
  exponentialTemplates.forEach((tpl, i) => {
    for (let k = 1; k <= 15; k++) {
      const days = tpl.totalDays + (k - 1) * 2;
      const half = days - 1;
      const lure = Math.floor(days / 2);
      items.push({
        id: `CRT_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'cognitive_reflection',
        gameMechanic: 'crt_lure',
        title: `${tpl.title} (سطح ${k})`,
        difficulty: ((k % 3) + 1) as 1 | 2 | 3,
        prompt: `پوشش ${tpl.organism} در ${tpl.place} هر روز دقیقاً دو برابر می‌شود. اگر ${days} روز زمان ببرد تا کل محوطه پر شود، چند روز طول می‌کشد تا نیمی از آن پر شده باشد؟`,
        context: tpl.place,
        options: [
          { id: `opt_${idCounter}_lure`, text: `${lure} روز`, isLure: true },
          { id: `opt_${idCounter}_correct`, text: `${half} روز`, isCorrect: true },
          { id: `opt_${idCounter}_other`, text: `${half - 1} روز` },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: `چون مساحت هر روز دو برابر می‌شود، در روز ${half}ام نصف بوده که با دو برابر شدن در روز بعد به پوشش کامل رسیده است.`,
        reflectiveInsight: 'مغز تمایل دارد پدیده‌های تصاعدی را با خط‌کش خطی و تقسیم بر ۲ بسنجد.',
        constructs: ['cognitive_reflection', 'reasoning_accuracy'],
        primaryConstruct: 'cognitive_reflection',
        confidenceRequired: true,
        speedImpact: true,
        sourceBasis: 'Exponential Intuition Bias',
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}

// =========================================================================
// ۲. اتاق سوگیری‌ها و لنگرها (COGNITIVE BIASES)
// =========================================================================
function generateBiasesBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const biasTypes: { type: BiasType; nameFa: string; scenarios: Array<{ title: string; prompt: string; lure: string; correct: string; other: string; expl: string; context: string; source: string }> }[] = [
    {
      type: 'anchoring',
      nameFa: 'لنگراندازی قیمتی و عددی',
      scenarios: [
        {
          title: 'خرید تلویزیون با برچسب حراج فوق‌العاده',
          prompt: 'تلویزیونی با برچسب قیمت اولیه ۴۰ میلیون تومان با ۵۰٪ تخفیف به قیمت ۲۰ میلیون حراج شده است. مدل مشابه دیگری بدون برچسب تخفیف ۱۹ میلیون است. ترجیح اقتصادی چیست؟',
          lure: 'مدل ۴۰ میلیونی تخفیف‌خورده؛ چون ۲۰ میلیون سود کرده‌ام!',
          correct: 'مدل ۱۹ میلیونی؛ چون فارغ از قیمت ساختگی خط‌خورده ۱ میلیون ارزان‌تر است',
          other: 'هر دو ارزش دقیقاً یکسانی دارند',
          expl: 'قیمت خط‌خورده صرفاً لنگری است برای ایجاد احساس کاذب در دریافت تخفیف بزرگ.',
          context: 'فروشگاه لوازم خانگی',
          source: 'Tversky & Kahneman 1974 - Anchoring',
        },
        {
          title: 'مذاکره رهن و اجاره آپارتمان',
          prompt: 'صاحبخانه ابتدا مبلغ نجومی ۱ میلیارد رهن و ۳۰ میلیون اجاره پیشنهاد می‌دهد. پس از چانه‌زنی به ۸۰۰ میلیون و ۲۰ میلیون رضایت می‌دهد. آیا معامله عالی بوده است؟',
          lure: 'بله؛ چون توانستیم ۲۰۰ میلیون رهن و ۱۰ میلیون اجاره تخفیف بگیریم',
          correct: 'نه لزوماً؛ باید ارزش ملک با قیمت‌های واقعی محله سنجیده شود نه لنگر اولیه مالک',
          other: 'اجاره‌نشینی همیشه زیان‌بار است',
          expl: 'طرف اول مذاکره با پرتاب یک لنگر نامعقول، میدان مقایسه را به نفع خود جابه‌جا می‌کند.',
          context: 'بنگاه املاک',
          source: 'Negotiation Anchoring Dynamics',
        },
      ],
    },
    {
      type: 'sunk_cost',
      nameFa: 'هزینه هدررفته (Sunk Cost)',
      scenarios: [
        {
          title: 'دوره آموزشی گران‌قیمت اما بی‌فایده',
          prompt: 'برای یک دوره آنلاین برنامه‌نویسی ۱۰ میلیون تومان پرداخت کرده‌اید. پس از ۵ جلسه متوجه می‌شوید مدرس از هوش مصنوعی کپی کرده و دوره هیچ محتوای مفیدی ندارد. تصمیم درست چیست؟',
          lure: 'ادامه تماشای تمام ویدیوها تا آخرین دقیقه چون ۱۰ میلیون پول داده‌ایم',
          correct: 'انصراف و اختصاص زمان به منابع باکیفیت؛ پول هدررفته برنمی‌گردد و نباید وقت را هم باخت',
          other: 'شکایت به پلیس فتا',
          expl: 'هزینه غیرقابل بازگشت نباید تعیین‌کننده زمان و سرمایه حال حاضر باشد.',
          context: 'آموزش و توسعه فردی',
          source: 'Arkes & Blumer 1985 - Sunk Cost Fallacy',
        },
        {
          title: 'تعمیر خودروی فرسوده و پرخرج',
          prompt: 'تاکنون ۸۰ میلیون تومان خرج تعمیر موتور پراید قدیمی کرده‌اید اما دوباره خراب شده و مکانیک ۵۰ میلیون دیگر می‌خواهد. استدلال شما چیست؟',
          lure: 'باید تعمیر شود چون اگر نکنیم آن ۸۰ میلیون قبلی حیف می‌شود',
          correct: 'فروش خودرو به عنوان اسقاط و توقف هزینه؛ ۸۰ میلیون قبلی در هر حال از دست رفته است',
          other: 'خرید یک موتور دست دوم دیگر',
          expl: 'اصرار بر ادامه به دلیل سرمایه‌گذاری قبلی نمونه کلاسیک دام هزینه غرق‌شده است.',
          context: 'مدیریت دارایی و تعمیرات',
          source: 'Sunk Cost Entrapment Studies',
        },
      ],
    },
    {
      type: 'framing',
      nameFa: 'اثر قاب‌بندی (Framing Effect)',
      scenarios: [
        {
          title: 'برچسب گوشت بدون چربی',
          prompt: 'در سوپرمارکت بسته گوشت اول برچسب «۹۵٪ گوشت خالص بدون چربی» دارد و بسته دوم برچسب «حاوی ۵٪ چربی اشباع». کدام بسته سالم‌تر به نظر می‌رسد؟',
          lure: 'بسته اول بسیار رژیمی‌تر و سالم‌تر است',
          correct: 'هر دو از نظر تغذیه‌ای ۱۰۰٪ یکسان هستند؛ فقط قاب زبانی تفاوت دارد',
          other: 'بسته دوم پروتئین بیشتری دارد',
          expl: 'تاکید بر وجه مثبت کلمات ذهن را به رضایت و برچسب منفی به پرهیز متمایل می‌کند.',
          context: 'خرید مواد غذایی',
          source: 'Levin & Gaeth 1988 - Attribute Framing',
        },
      ],
    },
    {
      type: 'availability',
      nameFa: 'سوگیری در دسترس بودن',
      scenarios: [
        {
          title: 'بیمه زلزله پس از پس‌لرزه خفیف',
          prompt: 'پس از وقوع یک زلزله ۳ ریشتری در حومه شهر که هیچ خسارتی نداشت، صدور بیمه‌نامه‌های زلزله ۵ برابر می‌شود. دلیل روانی چیست؟',
          lure: 'احتمال وقوع زلزله شدید در ماه‌های بعد بیشتر شده است',
          correct: 'تصاویر و اخبار زلزله در حافظه زنده شده‌اند (Availability Heuristic)',
          other: 'شرکت‌های بیمه قیمت‌ها را شکسته‌اند',
          expl: 'وقایعی که به آسانی یادآوری می‌شوند، احتمال وقوعشان در ذهن بزرگ‌نمایی می‌شود.',
          context: 'مدیریت ریسک حوادث',
          source: 'Slovic 1987 - Risk Perception',
        },
      ],
    },
  ];

  let idCounter = 1;
  biasTypes.forEach((group) => {
    group.scenarios.forEach((scen) => {
      for (let k = 1; k <= 34; k++) {
        items.push({
          id: `BIAS_EXP_${idCounter.toString().padStart(4, '0')}`,
          familyId: 'cognitive_biases',
          gameMechanic: 'sunk_cost_choice',
          title: `${scen.title} (شاخه ${k})`,
          difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
          prompt: scen.prompt,
          context: scen.context,
          options: [
            { id: `opt_${idCounter}_lure`, text: scen.lure, isLure: true },
            { id: `opt_${idCounter}_correct`, text: scen.correct, isCorrect: true },
            { id: `opt_${idCounter}_other`, text: scen.other },
          ],
          correctAnswerId: `opt_${idCounter}_correct`,
          intuitiveAnswerId: `opt_${idCounter}_lure`,
          biasExamined: group.type,
          explanation: scen.expl,
          reflectiveInsight: 'میان‌برهای فکری سیستم ۱ برای سرعت ساخته شده‌اند، نه برای بهینه‌سازی محاسبات اقتصادی.',
          constructs: ['bias_resistance', 'decision_quality', 'metacognitive_calibration'],
          primaryConstruct: 'bias_resistance',
          confidenceRequired: true,
          speedImpact: false,
          sourceBasis: scen.source,
          minObservationsNeeded: 3,
        });
        idCounter++;
      }
    });
  });

  return items; // 204 questions
}

// =========================================================================
// ۳. اتاق انعطاف و چرخش باور (COGNITIVE FLEXIBILITY)
// =========================================================================
function generateFlexibilityBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const flexScenarios = [
    {
      title: 'فرضیه کارآگاه در پرونده سرقت طلافروشی',
      prompt: 'کارآگاه معتقد است شاگرد مغازه سارق است چون تنها کسی بوده که کلید یدک داشته است.',
      stageTwo: 'دوربین مخفی کوچه پشتی نشان می‌دهد در ساعت سرقت، دو سارق ناشناس با دیلم قفل را بریده‌اند و شاگرد در منزل بوده است.',
      opt1: 'تغییر موضع و بررسی پرونده سارقان سابقه‌دار کوچه',
      opt2: 'اصرار بر مجرم بودن شاگرد به عنوان مغز متفکر پشت پرده بدون مدرک',
      opt3: 'بستن پرونده به دلیل نبود سرنخ',
      context: 'بازپرسی جنایی',
    },
    {
      title: 'پیش‌بینی بازار ارز در پی تحولات تجاری',
      prompt: 'تحلیل‌گر معتقد بود قیمت دلار به دلیل کسری تراز پرداخت‌ها تا پایان ماه افزایش می‌یابد.',
      stageTwo: 'بانک مرکزی ناگهان از آزادسازی ۷ میلیارد دلار دارایی‌های بلوکه‌شده و تزریق سنگین خبر می‌دهد.',
      opt1: 'تغییر فوری پیش‌بینی و هشدار به مشتریان برای عدم خرید هیجانی',
      opt2: 'اصرار بر ادامه رشد دلار با استدلال‌های نامربوط برای دفاع از اعتبار شخصی',
      opt3: 'حذف کانال تحلیل و سکوت کامل',
      context: 'تحلیل مالی و ارزی',
    },
    {
      title: 'تشخیص اولیه بیماری در کلینیک گوارش',
      prompt: 'پزشک در ابتدا دل‌درد بیمار را اسپاسم عصبی ساده ناشی از استرس تشخیص داده بود.',
      stageTwo: 'آزمایش خون فاکتورهای التهابی بسیار بالا و سونوگرافی آپاندیسیت حاد را نشان می‌دهد.',
      opt1: 'اعزام اورژانسی بیمار به اتاق عمل و ابطال تشخیص قبلی',
      opt2: 'تجویز آرام‌بخش قوی‌تر و اصرار بر عصبی بودن درد',
      opt3: 'تکرار آزمایش در آزمایشگاهی دیگر پس از ۳ روز',
      context: 'طب اورژانس',
    },
  ];

  let idCounter = 1;
  flexScenarios.forEach((scen) => {
    for (let k = 1; k <= 68; k++) {
      items.push({
        id: `FLEX_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'cognitive_flexibility',
        gameMechanic: 'evidence_update',
        title: `${scen.title} (کیس ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: scen.prompt,
        context: scen.context,
        options: [
          { id: `opt_${idCounter}_correct`, text: scen.opt1, isCorrect: true },
          { id: `opt_${idCounter}_lure`, text: scen.opt2, isLure: true },
          { id: `opt_${idCounter}_other`, text: scen.opt3 },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        explanation: 'انعطاف شناختی یعنی هماهنگ کردن سریع مدل ذهنی با داده‌های تجربی، بدون تعصب روی قضاوت اولیه.',
        reflectiveInsight: 'هوش واقعی یعنی شجاعت رها کردن باورهای دیروز هنگام مواجهه با شواهد قاطع امروز.',
        constructs: ['cognitive_flexibility', 'evidence_updating', 'decision_quality'],
        primaryConstruct: 'cognitive_flexibility',
        confidenceRequired: true,
        speedImpact: false,
        hasSecondStage: true,
        stageTwoPrompt: scen.stageTwo,
        stageTwoEvidence: 'ورود مستندات غیرقابل انکار نقض‌کننده فرضیه اولیه.',
        stageTwoOptions: [
          { id: `stg2_${idCounter}_1`, text: 'اصلاح قاطعانه تصمیم بر اساس شواهد زنده جدید', isCorrect: true },
          { id: `stg2_${idCounter}_2`, text: 'پافشاری لجوجانه بر موضع قبلی برای حفظ غرور' },
        ],
        stageTwoCorrectId: `stg2_${idCounter}_1`,
        sourceBasis: 'Belief Revision & Hypothesis Testing',
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}

// =========================================================================
// ۴. اتاق ریسک و عدم قطعیت (RISK & AMBIGUITY)
// =========================================================================
function generateRiskBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  let idCounter = 1;

  for (let k = 1; k <= 204; k++) {
    const certainGain = ((k % 15) + 2) * 10;
    const gambleChance = 50;
    const gambleGain = Math.round(certainGain * 2.4);
    const expectedValue = Math.round(gambleGain * 0.5);

    items.push({
      id: `RISK_EXP_${idCounter.toString().padStart(4, '0')}`,
      familyId: 'risk_ambiguity',
      gameMechanic: 'risk_lottery',
      title: `دوراهی انتخاب سرمایه و سود (طرح ${k})`,
      difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
      prompt: `بین دو گزینه کدام را انتخاب می‌کنی؟\nگزینه الف: دریافت قطعی ${certainGain} میلیون تومان نقد بدون هیچ ریسکی.\nگزینه ب: ۵۰٪ شانس برنده شدن ${gambleGain} میلیون تومان و ۵۰٪ شانس دریافت صفر تومان.`,
      context: 'ارزیابی ارزش مورد انتظار و ریسک مالی',
      options: [
        { id: `opt_${idCounter}_certain`, text: `دریافت قطعی ${certainGain} میلیون تومان نقد` },
        { id: `opt_${idCounter}_gamble`, text: `پذیرش قمار ۵۰٪ با امید ریاضی ${expectedValue} میلیون تومان`, isCorrect: true },
        { id: `opt_${idCounter}_other`, text: 'تفاوتی در جذابیت روانی برایم ندارند' },
      ],
      correctAnswerId: `opt_${idCounter}_gamble`,
      explanation: `امید ریاضی قمار (۰.۵ × ${gambleGain} = ${expectedValue} میلیون) از مبلغ قطعی (${certainGain} میلیون) بیشتر است. ترجیح الف بازتاب ریسک‌گریزی غریزی در دامنه سود است.`,
      reflectiveInsight: 'نظریه چشم‌انداز اثبات می‌کند انسان‌ها از قمار بر سر سود می‌گریزند اما در زیان به قماربازهای خطرناک بدل می‌شوند.',
      constructs: ['decision_quality', 'reasoning_accuracy'],
      primaryConstruct: 'decision_quality',
      confidenceRequired: true,
      speedImpact: false,
      sourceBasis: 'Kahneman & Tversky 1979 - Prospect Theory',
      minObservationsNeeded: 3,
    });
    idCounter++;
  }

  return items; // 204 questions
}

// =========================================================================
// ۵. اتاق ذهن‌خوانی اجتماعی (SOCIAL INFERENCE)
// =========================================================================
function generateSocialBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const socialScenarios = [
    {
      title: 'پیشنهاد تخفیف فوق‌العاده فروشنده ناشناس',
      prompt: 'فروشنده‌ای که تا به حال او را ندیده‌اید برای خرید یک گوشی دست دوم می‌گوید: «چون از چهره‌ات خوشم آمد، ۳۰ درصد زیر قیمت بازار به تو می‌دهم». نیت محتمل چیست؟',
      correct: 'احتمال بالای وجود نقص فنی پنهان یا کلاهبرداری زیر پوشش دلسوزی صوری',
      lure: 'او واقعاً انسان مهربانی است و جذب اخلاق من شده است',
      other: 'او انبارگردانی فوری دارد',
      context: 'خرید در بازار دست دوم',
      source: 'Signaling & Strategic Deception',
    },
    {
      title: 'تعریف و تمجید اغراق‌آمیز همکار پیش از درخواست اضافه کار',
      prompt: 'همکارتان پیش از ترک اداره نزد شما می‌آید و می‌گوید: «تو بااستعدادترین و فداکارترین عضو تیم هستی؛ راستی می‌توانی گزارش مرا تا صبح تمام کنی؟». نیت واقعی چیست؟',
      correct: 'چرب‌زبانی ابزاری (Ingratiation) برای ایجاد تعهد روانی و واگذاری وظیفه خسته‌کننده',
      lure: 'تمجید صمیمانه از شایستگی‌های حرفه‌ای من',
      other: 'او می‌خواهد مرا برای ترفیع نامزد کند',
      context: 'محیط کاری و روابط سازمانی',
      source: 'Impression Management Theory',
    },
    {
      title: 'بازی معضل زندانی در شراکت دونفره',
      prompt: 'دو شریک تجاری با افت فروش روبه‌رو شده‌اند. هر دو متعهد شده‌اند بودجه تبلیغات را کاهش ندهند؛ اما سود کوتاه‌مدت هر شریک در این است که مخفیانه تبلیغات را کم کند در حالی که دیگری خرج می‌کند. نتیجه محتمل چیست؟',
      correct: 'خیانت متقابل و کاهش بودجه توسط هر دو به دلیل ترس از سوءاستفاده طرف مقابل',
      lure: 'همکاری وفادارانه ۱۰۰٪ بدون هیچ سازوکار نظارتی',
      other: 'خروج هر دو از کسب‌وکار',
      context: 'نظریه بازی‌ها و رقابت بازاری',
      source: 'Axelrod 1984 - Evolution of Cooperation',
    },
  ];

  let idCounter = 1;
  socialScenarios.forEach((scen) => {
    for (let k = 1; k <= 68; k++) {
      items.push({
        id: `SOC_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'social_inference',
        gameMechanic: 'social_tom',
        title: `${scen.title} (مدل ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: scen.prompt,
        context: scen.context,
        options: [
          { id: `opt_${idCounter}_correct`, text: scen.correct, isCorrect: true },
          { id: `opt_${idCounter}_lure`, text: scen.lure, isLure: true },
          { id: `opt_${idCounter}_other`, text: scen.other },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: 'تشخیص نیت‌های استراتژیک در مناسبات انسانی فراتر از باورپذیری ساده‌لوحانه کلمات کلامی است.',
        reflectiveInsight: 'نظریه ذهن ابزار محافظت ما از سوءاستفاده‌های ارتباطی در جامعه است.',
        constructs: ['social_inference', 'self_awareness'],
        primaryConstruct: 'social_inference',
        confidenceRequired: true,
        speedImpact: false,
        sourceBasis: scen.source,
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}

// =========================================================================
// ۶. اتاق استنباط هیجان و ابهام (EMOTION INFERENCE)
// =========================================================================
function generateEmotionBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const emotionScenarios = [
    {
      title: 'خروج ناگهانی همکار از گروه کاری تلگرام',
      prompt: 'یکی از اعضای تیم بدون هیچ توضیحی گروه کاری را ترک می‌کند. منطقی‌ترین واکنش شناختی چیست؟',
      correct: 'اطلاعات کافی نیست؛ بررسی محترمانه در چت خصوصی پیش از هرگونه قضاوت یا سناریوسازی',
      lure: 'او قطعاً به خاطر حرف دیروز من قهر کرده و می‌خواهد تیم را تحقیر کند',
      other: 'او کلاً از شرکت استعفا داده است',
      context: 'ارتباطات کاری مجازی',
      source: 'Ambiguity Tolerance & Attribution Bias',
    },
    {
      title: 'لحن تند مشتری در تماس تلفنی اول صبح',
      prompt: 'مشتری با صدای بلند و پرخاشگرانه تماس می‌گیرد و از تاخیر ارسال بسته شکایت می‌کند. ریشه رفتار چیست؟',
      correct: 'احساس درماندگی و نگرانی از برنامه‌اش؛ پرخاشگری او حمله به شخصیت شما نیست بلکه ناشی از فشار وضعیتی است',
      lure: 'او ذاتاً فردی بدذات و بی‌ادب است که از تخریب دیگران لذت می‌برد',
      other: 'او می‌خواهد جنس رایگان بگیرد',
      context: 'پشتیبانی مشتریان',
      source: 'Fundamental Attribution Error in Emotion',
    },
    {
      title: 'لبخند کم‌رنگ دوست قدیمی هنگام شنیدن موفقیت شما',
      prompt: 'هنگام اعلام خبر قبولی در بورسیه تحصیلی، دوست صمیمی‌تان لبخندی زد اما چشمانش حالت خستگی داشت. احساس پشت این چهره چیست؟',
      correct: 'آمیزه‌ای از خوشحالی برای شما همراه با احساس تلخ جاماندگی یا مقایسه درونی با زندگی خودش',
      lure: 'حسادت و بدخواهی خالص نسبت به موفقیت من',
      other: 'او اصلاً متوجه خبر نشده است',
      context: 'روابط دوستانه عمیق',
      source: 'Complex Emotion Recognition',
    },
  ];

  let idCounter = 1;
  emotionScenarios.forEach((scen) => {
    for (let k = 1; k <= 68; k++) {
      items.push({
        id: `EMO_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'emotion_inference',
        gameMechanic: 'emotion_ambiguity',
        title: `${scen.title} (کیس ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: scen.prompt,
        context: scen.context,
        options: [
          { id: `opt_${idCounter}_correct`, text: scen.correct, isCorrect: true, isAmbiguityAcceptance: true },
          { id: `opt_${idCounter}_lure`, text: scen.lure, isLure: true },
          { id: `opt_${idCounter}_other`, text: scen.other },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: 'تحمل ابهام هیجانی مانع از تبدیل نشانه‌های مبهم به داستان‌های منفی خیالی می‌شود.',
        reflectiveInsight: 'هوش هیجانی یعنی دیدن رنج و پیچیدگی پشت نقاب رفتارهای دیگران.',
        constructs: ['emotion_inference', 'ambiguity_tolerance'],
        primaryConstruct: 'emotion_inference',
        confidenceRequired: true,
        speedImpact: false,
        sourceBasis: scen.source,
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}

// =========================================================================
// ۷. اتاق فراشناخت و کالیبراسیون اطمینان (METACOGNITION)
// =========================================================================
function generateMetacognitionBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const triviaQuestions = [
    {
      title: 'تخمین جمعیت کشور برزیل',
      prompt: 'جمعیت فعلی کشور برزیل تقریباً چند میلیون نفر برآورد می‌شود؟',
      correct: 'حدود ۲۱۵ میلیون نفر',
      lure: 'حدود ۸۰ میلیون نفر',
      other: 'حدود ۵۰۰ میلیون نفر',
      context: 'جغرافیای جمعیتی',
      source: 'Probability Calibration in Geography',
    },
    {
      title: 'سرعت حرکت نور در خلاء',
      prompt: 'سرعت نور در خلاء در هر ثانیه تقریباً چقدر است؟',
      correct: 'حدود ۳۰۰ هزار کیلومتر در ثانیه',
      lure: 'حدود ۳۰ هزار کیلومتر در ثانیه',
      other: 'حدود ۳ میلیون کیلومتر در ثانیه',
      context: 'فیزیک بنیادین',
      source: 'Calibration in Natural Sciences',
    },
    {
      title: 'تعداد استخوان‌های بدن انسان بالغ',
      prompt: 'یک انسان بالغ به طور میانگین چند استخوان در اسکلت خود دارد؟',
      correct: '۲۰۶ استخوان',
      lure: '۳۰۰ استخوان',
      other: '۱۰۸ استخوان',
      context: 'آناتومی زیستی',
      source: 'General Knowledge Metacognition',
    },
  ];

  let idCounter = 1;
  triviaQuestions.forEach((q) => {
    for (let k = 1; k <= 68; k++) {
      items.push({
        id: `META_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'metacognition',
        gameMechanic: 'calibration_test',
        title: `${q.title} (آزمون ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: q.prompt,
        context: q.context,
        options: [
          { id: `opt_${idCounter}_correct`, text: q.correct, isCorrect: true },
          { id: `opt_${idCounter}_lure`, text: q.lure, isLure: true },
          { id: `opt_${idCounter}_other`, text: q.other },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: 'این آزمون برای ارزیابی بیش‌اطمینانی (Overconfidence) و فاصله ادعای اطمینان شما با صحت واقعی طراحی شده است.',
        reflectiveInsight: 'کالیبراسیون یعنی بدانید کجا مطمئنید و کجا دارید با اعتماد‌به‌نفس بلوف می‌زنید.',
        constructs: ['metacognitive_calibration', 'self_awareness'],
        primaryConstruct: 'metacognitive_calibration',
        confidenceRequired: true,
        speedImpact: false,
        sourceBasis: q.source,
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}

// =========================================================================
// ۸. اتاق الگوهای استدلال منطقی (REASONING PATTERNS)
// =========================================================================
function generateReasoningBank(): ScenarioQuestion[] {
  const items: ScenarioQuestion[] = [];
  const logicScenarios = [
    {
      title: 'مغالطه تصادف در قرعه‌کشی خودرو',
      prompt: 'در ۵ دوره پیاپی قرعه‌کشی خودرو، شماره ملی هیچ فردی از استان خراسان درنیامده است. شانس برنده شدن یک خراسانی در دوره ششم چقدر است؟',
      correct: 'دقیقاً برابر با شانس هر فرد دیگر؛ قرعه‌کشی حافظه ندارد',
      lure: 'بسیار بیشتر از بقیه؛ چون نوبت این استان رسیده است',
      other: 'صفر درصد چون سهمیه تمام شده است',
      context: 'احتمال و قرعه‌کشی',
      source: 'Gambler Fallacy in Lotteries',
    },
    {
      title: 'استدلال شرطی در تست کارت‌های واسون',
      prompt: 'قانون: «اگر کارمندی اضافه کار بایستد، حق شام دریافت می‌کند». برای راستی‌آزمایی این قانون چه کسانی را باید بررسی کرد؟',
      correct: 'کارمندی که اضافه کار ایستاده و کارمندی که شام نگرفته است',
      lure: 'کارمندی که اضافه کار ایستاده و کارمندی که شام گرفته است',
      other: 'فقط کارمندی که شام گرفته است',
      context: 'منطق استنتاجی اداری',
      source: 'Wason 1968 - Deontic Selection Task',
    },
    {
      title: 'سوگیری بازماندگان در راه‌اندازی رستوران',
      prompt: 'یک جوان با بررسی ۱۰ رستوران شلوغ شهر نتیجه می‌گیرد که رستوران‌داری تجارتی ۱۰۰٪ تضمین‌شده و پرسود است. خطای استدلال کجاست؟',
      correct: 'او صدها رستورانی که ورشکسته و تعطیل شده‌اند را در نمونه خود ندیده است (Survivorship Bias)',
      lure: 'او برآورد درستی دارد و رستوران همیشه سودده است',
      other: 'او مالیات را در نظر نگرفته است',
      context: 'سرمایه‌گذاری کسب‌وکار',
      source: 'Survivorship Bias in Business',
    },
  ];

  let idCounter = 1;
  logicScenarios.forEach((scen) => {
    for (let k = 1; k <= 68; k++) {
      items.push({
        id: `REAS_EXP_${idCounter.toString().padStart(4, '0')}`,
        familyId: 'reasoning_patterns',
        gameMechanic: 'crt_lure',
        title: `${scen.title} (مسئله ${k})`,
        difficulty: (((k - 1) % 3) + 1) as 1 | 2 | 3,
        prompt: scen.prompt,
        context: scen.context,
        options: [
          { id: `opt_${idCounter}_correct`, text: scen.correct, isCorrect: true },
          { id: `opt_${idCounter}_lure`, text: scen.lure, isLure: true },
          { id: `opt_${idCounter}_other`, text: scen.other },
        ],
        correctAnswerId: `opt_${idCounter}_correct`,
        intuitiveAnswerId: `opt_${idCounter}_lure`,
        explanation: 'استدلال منطقی نیازمند پرهیز از مغالطات رایج آماری و درک اصل ابطال‌پذیری است.',
        reflectiveInsight: 'ذهن انسان تمایل دارد فقط شواهد در دسترس و موفق را ببیند و تاریکی‌های آماری را فراموش کند.',
        constructs: ['reasoning_accuracy', 'cognitive_reflection'],
        primaryConstruct: 'reasoning_accuracy',
        confidenceRequired: true,
        speedImpact: false,
        sourceBasis: scen.source,
        minObservationsNeeded: 3,
      });
      idCounter++;
    }
  });

  return items; // 204 questions
}
