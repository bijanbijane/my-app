/**
 * Cognitive Humor & Mysterious Companion Engine
 * Intimate, playful, and enigmatic Persian tone for ZehnNama
 */

export const MYSTERIOUS_TRAP_ROASTS = [
  'شکارچی تو رو کشید همون سمتی که دلش می‌خواست! تله خیلی نرم عمل کرد.',
  'مغزت میان‌بر زد، از کوچه بن‌بست رفت و صاف افتاد تو چاله شهود!',
  'دیدیش؟ اولین فکری که پرید تو کله‌ات، دقیقاً همون سرابی بود که برات چیده بودیم.',
  'سیستم یک ذهنت سریع دوید دکمه رو زد! قشر پیش‌پیشانی تازه داره خمیازه می‌کشه.',
  'دستت نلرزید، ولی پای عقلت لغزید! این تله مخصوص آدم‌های باهوش و عجول بود.',
  'چشم‌ها دید، دل باور کرد، عقل بعد از کلیک تازه گفت: «صبر کن ببینم...»',
  'طراح این معما الان داره به این انتخابت لبخند می‌زنه؛ درست رفتی تو دهان شیر!',
];

export const MYSTERIOUS_SUCCESS_PRAISES = [
  'عالی بود! چشمت رو بستی رو اولین پاسخ وسوسه‌انگیز و دست تله رو خوندی.',
  'ترمز ABS مغزت به موقع کشیده شد؛ پنیر رو بو کردی ولی تو تله نیفتادی!',
  'دانیل کانهمن اگه زنده بود، الان برات دست می‌زد. سیستم ۲ رو استادانه روشن کردی.',
  'از تاریکی رد شدی بدون اینکه پات گیر کنه به ریشه‌های خطای ذهنی!',
  'هوشمندانه بود؛ بیشتر آدم‌ها اینجا غرق می‌شن، ولی تو قایق نجات رو پیدا کردی.',
];

export const PLAYFUL_CONFIDENCE_SCALE: { min: number; max: number; label: string; sub: string }[] = [
  {
    min: 0,
    max: 20,
    label: 'تیر در تاریکی مطلق!',
    sub: 'شانسم مثل پیدا کردن سوزن تو انبار کاهه، ولی زدم رفت!',
  },
  {
    min: 21,
    max: 45,
    label: 'شاید آره، شاید نه...',
    sub: 'مثل هوای بهاری؛ باد از هر طرف بوزه می‌رم اون سمتی!',
  },
  {
    min: 46,
    max: 65,
    label: 'نصف دلم میگه درسته',
    sub: 'پنجاه‌-پنجاه، با چاشنی دلهره و شک ملایم.',
  },
  {
    min: 66,
    max: 85,
    label: 'بوی حقیقت رو حس می‌کنم',
    sub: 'حساب‌وکتاب کردم، الکی سر تکون ندادم.',
  },
  {
    min: 86,
    max: 100,
    label: 'قسم جلاله می‌خورم!',
    sub: 'سند شش‌دانگ می‌ذارم وسط؛ محاله اشتباه باشه!',
  },
];

export const ENIGMATIC_DAILY_QUIPS = [
  '«ذهنت در هر ثانیه یازده میلیون بیت اطلاعات می‌گیره، ولی فقط چهل تاش رو متوجه می‌شی. بقیه‌اش رو کی هدایت می‌کنه؟»',
  '«تخفیف ۵۰٪ یعنی پرداخت پولی که نداشتی، برای جنسی که نمی‌خواستی، تا احساس برنده بودن کنی!»',
  '«خطرناک‌ترین دروغ، دروغیه که خودت با منطق خودت به خودت تحویل می‌دی!»',
  '«وقتی در حال قانع کردن خودتی، یادت باشه حریف و داور هم خودتی؛ معلومه می‌بری!»',
  '«لباس شیک و لحن مطمئن، مغالطه رو درمان نمی‌کنه؛ فقط بهش عطر می‌زنه!»',
  '«پولی که خرج کردی رفته؛ به خاطر یک اشتباه قدیمی، تمام امروزت رو حراج نکن!»',
];

export const DAILY_COGNITIVE_QUIPS = ENIGMATIC_DAILY_QUIPS;

export const ACADEMIC_TRAP_OBSERVATIONS = [
  'خطای شناختی ثبت شد: غلبه پردازش سریع اکتشافی (سیستم ۱) بر استدلال موشکافانه تحلیلی.',
  'سوگیری لنگراندازی و اثر در دسترس بودن موجب انحراف تخمین از ارزش واقعی شد.',
  'شکست در مهار پاسخ تکانشی (Inhibitory Control Failure) در مواجهه با متغیر برجسته.',
  'پاسخ شهودی اولیه به علت ساختار ذهنی میان‌بر (Heuristic) انتخاب گردید.',
  'اثر قاب‌بندی گزاره‌ها موجب خطای استنتاج و قضاوت نامتقارن شد.',
];

export const ACADEMIC_SUCCESS_OBSERVATIONS = [
  'مهار موفق پاسخ تکانشی و استنتاج بر پایه اصول سنجش منطقی و احتمالات.',
  'فعال‌سازی سیستم ۲ تحلیلی و مقاومت در برابر اثر جهت‌دهی صورت مسئله.',
  'انعطاف‌پذیری شناختی و به‌روزرسانی صحیح فرضیه اولیه در پرتو شواهد.',
  'تفکیک تمایز همبستگی ظاهری از علیت ساختاری با دقت بالا.',
];

export function getRandomTrapRoast(tone: 'witty' | 'academic' = 'witty'): string {
  if (tone === 'academic') {
    return ACADEMIC_TRAP_OBSERVATIONS[Math.floor(Math.random() * ACADEMIC_TRAP_OBSERVATIONS.length)];
  }
  const idx = Math.floor(Math.random() * MYSTERIOUS_TRAP_ROASTS.length);
  return MYSTERIOUS_TRAP_ROASTS[idx];
}

export function getRandomSuccessPraise(tone: 'witty' | 'academic' = 'witty'): string {
  if (tone === 'academic') {
    return ACADEMIC_SUCCESS_OBSERVATIONS[Math.floor(Math.random() * ACADEMIC_SUCCESS_OBSERVATIONS.length)];
  }
  const idx = Math.floor(Math.random() * MYSTERIOUS_SUCCESS_PRAISES.length);
  return MYSTERIOUS_SUCCESS_PRAISES[idx];
}

export function getConfidenceHumor(val: number) {
  const found = PLAYFUL_CONFIDENCE_SCALE.find((s) => val >= s.min && val <= s.max);
  return found || PLAYFUL_CONFIDENCE_SCALE[2];
}

export function getCognitiveArchetype(accuracy: number, avgConfidence: number, lureRate: number): {
  title: string;
  badge: string;
  roast: string;
} {
  if (accuracy >= 80 && avgConfidence <= 70) {
    return {
      title: 'کارآگاه خونسرد در سایه‌ها',
      badge: '🕵️‍♂️ مچ‌گیر نامرئی',
      roast: 'پاسخ‌هات خیلی دقیق‌تر از ادعاهات هستند؛ چرا هی نبوغت رو دست‌کم می‌گیری؟',
    };
  }
  if (avgConfidence > accuracy + 25) {
    return {
      title: 'شعبده‌باز با ادعای بی‌نهایت',
      badge: '🚀 شیرجه‌زن در تاریکی',
      roast: 'اعتماد‌به‌نفست قله‌ها رو فتح می‌کنه، حیف که گاهی قله‌ها توخالی از آب درمی‌آیند!',
    };
  }
  if (lureRate >= 0.5) {
    return {
      title: 'دوستدار خوش‌بین سراب‌ها',
      badge: '⚡ شتاب‌زده‌ی دل‌پاک',
      roast: 'اولین فکری که میاد تو کله‌ات رو بغل می‌کنی! یکم ترمز دستی رو بکش رفیق.',
    };
  }
  if (accuracy >= 70 && lureRate < 0.25) {
    return {
      title: 'شکارچی تله‌های شناختی',
      badge: '🧠 ذهن ضدضربه',
      roast: 'هیچ شعبده‌بازی نمی‌تونه سرت کلاه بذاره؛ دیوارهای ذهنت از فولاد ساخته شده!',
    };
  }
  return {
    title: 'مسافر هزارتوی ذهن',
    badge: '🧭 جوینده رازها',
    roast: 'داری کم‌کم رگ خواب خطاهای ذهنت رو پیدا می‌کنی؛ ماجرا تازه داره جالب می‌شه!',
  };
}
