import { CognitiveRoleConfig, CognitiveRoleId } from '../types';

export const COGNITIVE_ROLES: Record<CognitiveRoleId, CognitiveRoleConfig> = {
  detective: {
    id: 'detective',
    nameFa: 'کارآگاه تیزبین',
    avatarEmoji: '🕵️‍♂️',
    badgeTitleFa: 'مچ‌گیر تناقض‌ها',
    taglineFa: '«شیطان در جزئیاتی پنهان شده که بقیه از کنارش رد می‌شوند.»',
    descriptionFa:
      'در نقش کارآگاه، تو باید بازجویی‌ها و شواهد متناقض را وارسی کنی. فریب ظاهر آراسته متهمان را نخور و فرضیه اولت را با آمدن مدرک جدید بی‌تردید اصلاح کن.',
    primaryFamily: 'cognitive_flexibility',
    color: '#f59e0b', // amber
    accentBg: 'from-amber-500/15 via-slate-900 to-amber-950/20',
    missionsTitleFa: 'حل پرونده‌های جنایی و تناقض شواهد',
    powerNameFa: 'ذره‌بین صحنه جرم',
    powerDescFa: 'حذف فوری یکی از گزینه‌های وسوسه‌کننده و اشتباه',
    powerIcon: 'Search',
  },
  judge: {
    id: 'judge',
    nameFa: 'قاضی دادگاه عقل',
    avatarEmoji: '⚖️',
    badgeTitleFa: 'ترازوی عدالت بی‌طرف',
    taglineFa: '«نه هیاهوی شاکی و نه مظلوم‌نمایی وکیل، ترازوی قضاوتم را کج نخواهد کرد.»',
    descriptionFa:
      'در ردای قاضی، مأموریت تو تفکیک بازی با کلمات و اثر قاب‌بندی از حقیقت محض است. هیچ ادعایی بدون سند پذیرفته نیست و لنگر قیمت‌ها یا خسارات توهمی نباید رایت را خدشه‌دار کند.',
    primaryFamily: 'cognitive_biases',
    color: '#a855f7', // purple
    accentBg: 'from-purple-500/15 via-slate-900 to-purple-950/20',
    missionsTitleFa: 'داوری بی‌طرفانه در دعاوی پیچیده',
    powerNameFa: 'چکش خنثی‌سازی لنگر',
    powerDescFa: 'نشانه‌گذاری لنگرها و تله‌های زبانی روی گزینه‌ها',
    powerIcon: 'Scale',
  },
  sage: {
    id: 'sage',
    nameFa: 'حکیم و فیلسوف فرزانه',
    avatarEmoji: '📜',
    badgeTitleFa: 'شکارچی پارادوکس‌ها',
    taglineFa: '«آغاز حکمت، سکوت است؛ و ترمز بر شهود شتاب‌زده، گوهر خرد است.»',
    descriptionFa:
      'حکیم به اولین فکری که به ذهنش می‌جهد اعتماد نمی‌کند. او پیش از پاسخ سه بار درنگ می‌کند، وسوسه میان‌برهای حسی را پس می‌زند و مغالطات منطق را در نطفه خفه می‌کند.',
    primaryFamily: 'cognitive_reflection',
    color: '#06b6d4', // cyan
    accentBg: 'from-cyan-500/15 via-slate-900 to-cyan-950/20',
    missionsTitleFa: 'حل پارادوکس‌ها و تعمق در رازهای منطق',
    powerNameFa: 'طومار مکث و درنگ',
    powerDescFa: 'رمزگشایی از زاویه انحراف فکر پیش از انتخاب',
    powerIcon: 'Scroll',
  },
  police: {
    id: 'police',
    nameFa: 'پلیس واکنش سریع',
    avatarEmoji: '👮‍♂️',
    badgeTitleFa: 'فرمانده مهار بحران',
    taglineFa: '«در کسری از ثانیه شلیک نکن؛ تفکیک سایه از تهدید واقعی، هنر من است.»',
    descriptionFa:
      'در لباس پلیس، باید تحت فشار شدید خیابان تصمیم‌گیری کنی. تعادل میان سرعت و دقت (Speed-Accuracy) حیاتی است؛ نه آن‌قدر کند که فرصت بسوزد، و نه آن‌قدر شتاب‌زده که به بیگناه آسیب برسد.',
    primaryFamily: 'reasoning_patterns',
    color: '#3b82f6', // blue
    accentBg: 'from-blue-500/15 via-slate-900 to-blue-950/20',
    missionsTitleFa: 'تصمیم‌گیری میلی‌ثانیه‌ای تحت فشار بحران',
    powerNameFa: 'پشتیبانی ضربتی یگان',
    powerDescFa: 'کسب ۳۰٪ امتیاز اضافه برای شجاعت و تصمیم‌گیری قاطع',
    powerIcon: 'Zap',
  },
  herbalist: {
    id: 'herbalist',
    nameFa: 'عطار و کیمیاگر کهن',
    avatarEmoji: '🌿',
    badgeTitleFa: 'میزان‌سنج اکسیرها',
    taglineFa: '«یک پروانه بال می‌زند، دوز دارو دگرگون می‌شود؛ در علم شفا، توهم جایی ندارد.»',
    descriptionFa:
      'عطار وسواس عجیبی در سنجش وزن و آمار دارد. او فریب روایت‌های عامیانه دارونما را نمی‌خورد و نرخ شیوع پایه بیماری‌ها (Base-Rate) را ملاک معجون‌های نجات‌بخش قرار می‌دهد.',
    primaryFamily: 'emotion_inference',
    color: '#10b981', // emerald
    accentBg: 'from-emerald-500/15 via-slate-900 to-emerald-950/20',
    missionsTitleFa: 'سنجش دوز داروها و ابطال توهمات درمانی',
    powerNameFa: 'اکسیر پایایی و شفا',
    powerDescFa: 'محافظت از نوار پیروزی (Streak) در برابر اولین خطای احتمالی',
    powerIcon: 'Shield',
  },
  chef: {
    id: 'chef',
    nameFa: 'سرآشپز چابک',
    avatarEmoji: '🍳',
    badgeTitleFa: 'استاد تعادل طعم‌ها',
    taglineFa: '«غذای سوخته را به مهمان تعارف نکن؛ شجاعت دور ریختن، راز شکوه طعم است.»',
    descriptionFa:
      'سرآشپز در اوج گرما و شلوغی سفارش‌ها مدیریت منابع می‌کند. او هرگز اسیر خطای هزینه هدررفته (Sunk Cost) نمی‌شود؛ اگر سسی خراب شد، فوراً از نو شروع می‌کند و کیفیت را فدای لجاجت نمی‌کند.',
    primaryFamily: 'risk_ambiguity',
    color: '#f97316', // orange
    accentBg: 'from-orange-500/15 via-slate-900 to-orange-950/20',
    missionsTitleFa: 'کیمیای زمان و تصمیم‌گیری بدون حسرت در آشپزخانه',
    powerNameFa: 'تیغ تفکیک سرآشپز',
    powerDescFa: 'کنار زدن تعارفات و آشکارسازی پاسخ بدون هزینه سوخته',
    powerIcon: 'Flame',
  },
};

export const ROLE_LIST: CognitiveRoleConfig[] = Object.values(COGNITIVE_ROLES);
