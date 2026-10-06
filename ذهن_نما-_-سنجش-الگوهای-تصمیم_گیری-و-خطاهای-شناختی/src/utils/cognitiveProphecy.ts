import { UserProfile, TrialResult } from '../types';

export interface CognitiveProphecy {
  biasNameFa: string;
  oracleTitleFa: string;
  oracleWhisperFa: string;
  dangerLevelPercent: number;
  dangerLevelFa: string;
  protectiveCharmFa: string; // The antidote / advice
  omenSignFa: string;
}

export function generateCognitiveProphecy(profile: UserProfile): CognitiveProphecy {
  const history = profile.history;

  if (history.length < 3) {
    return {
      biasNameFa: 'مه‌آلودگی اولیه',
      oracleTitleFa: 'پیش‌گویی در غبار',
      oracleWhisperFa:
        'گوی بلورین هنوز در مه غلیظی شناور است... ردپای تصمیم‌هایت هنوز آن‌قدر عمیق نشده که اهریمنِ تله‌ها را بشود احضار کرد. چند بازی دیگر انجام بده تا اولین پیش‌گویی سرنوشت‌ساز ظاهر شود.',
      dangerLevelPercent: 30,
      dangerLevelFa: 'در پرده ابهام',
      protectiveCharmFa: 'فقط آرام قدم بردار و به اولین پاسخ شک کن!',
      omenSignFa: '🔮 مه رقیق در آستانه درگاه',
    };
  }

  // Count past tendencies:
  const recentTrials = history.slice(0, 10);
  const lureCount = recentTrials.filter((t) => t.isIntuitiveLureSelected).length;
  const avgConf = recentTrials.reduce((s, t) => s + t.confidence, 0) / recentTrials.length;
  const accuracy = (recentTrials.filter((t) => t.isCorrect).length / recentTrials.length) * 100;
  const overconfidenceGap = avgConf - accuracy;

  const anchoringFails = history.filter(
    (t) => t.biasManifested === 'anchoring' || (t.isIntuitiveLureSelected && t.questionId.startsWith('BIAS_006'))
  ).length;

  const sunkCostFails = history.filter(
    (t) => t.biasManifested === 'sunk_cost' || (t.gameMechanic === 'sunk_cost_choice' && !t.isCorrect)
  ).length;

  const framingFails = history.filter(
    (t) => t.biasManifested === 'framing' || (t.gameMechanic === 'framing_split' && !t.isCorrect)
  ).length;

  const ambiguityFails = history.filter(
    (t) => t.familyId === 'emotion_inference' && !t.isCorrect && !t.ambiguityAccepted
  ).length;

  // Prophecy: Anchoring
  if (anchoringFails >= 2) {
    return {
      biasNameFa: 'طلسم لنگراندازی و اعداد اولیه',
      oracleTitleFa: 'فال ستاره‌ی اعداد: هیپنوتیزم قیمت اول',
      oracleWhisperFa:
        'کریستال تاریک نشان می‌دهد: در بازی بعدی اگر با رقمی درشت یا قیمتی خط‌خورده مواجه شوی، چشمانت طلسم خواهد شد! فروشندگان حراجی از فرسنگ‌ها دورتر برای شکار کیف پولت نقشه کشیده‌اند.',
      dangerLevelPercent: 88,
      dangerLevelFa: 'آسیب‌پذیری شدید (۸۸٪)',
      protectiveCharmFa: 'چشم‌هایت را ۲ ثانیه ببند و ارزش واقعی را از صفر حساب کن؛ عدد اول سرابی بیش نیست!',
      omenSignFa: '⚖️ ترازوی دستکاری‌شده',
    };
  }

  // Prophecy: Overconfidence
  if (overconfidenceGap > 20) {
    return {
      biasNameFa: 'توهم ادعا و بیش‌اطمینانی',
      oracleTitleFa: 'فال مشعل کورکننده: قمار روی سراب',
      oracleWhisperFa:
        'اوراکل می‌گوید: در معماهای بعدی با اطمینان ۹۵٪ یا ۱۰۰٪ روی پاسخی اصرار خواهی ورزید که از بیخ و بن اشتباه است! غرور شیرین، پیش‌مرگ تله‌های خفته در کمین توست.',
      dangerLevelPercent: 82,
      dangerLevelFa: 'هشدار طوفان غرور (۸۲٪)',
      protectiveCharmFa: 'هر بار دستت رفت روی ۱۰۰٪، یک فرضیه کاملاً متضاد را در ذهن بساز و دلیل غلط بودنش را بجو!',
      omenSignFa: '🔥 مشعل فروزان در گرداب',
    };
  }

  // Prophecy: Fast Intuitive Lure
  if (lureCount >= 4) {
    return {
      biasNameFa: 'شلیک شتابان به تله جواب اول',
      oracleTitleFa: 'فال شکار صیاد: صید آسان',
      oracleWhisperFa:
        'گوی شیشه‌ای تصویر انگشتی را می‌بیند که قبل از رسیدن پیام عصبی به قشر پیش‌پیشانی، روی اولین گزینه‌ی وسوسه‌انگیز فرود می‌آید! طراحان معما برایت دان پاشیده‌اند و تو پروازکنان به سوی قفس می‌روی.',
      dangerLevelPercent: 91,
      dangerLevelFa: 'شتاب‌زدگی بحرانی (۹۱٪)',
      protectiveCharmFa: 'سه ثانیه کامل نفس بکش و دستت را از روی صفحه گوشی بردار، بعد تصمیم بگیر!',
      omenSignFa: '⚡ صاعقه بر فراز بیشه',
    };
  }

  // Prophecy: Sunk Cost
  if (sunkCostFails >= 2) {
    return {
      biasNameFa: 'سوگیری هزینه هدررفته',
      oracleTitleFa: 'فال شبح خاکسترها: اصرار بر سوختن',
      oracleWhisperFa:
        'دیدگان غیب‌گو می‌بینند: در مواجهه بعدی با پروژه‌ای زیان‌ده، چون قبلاً بابتش خرج کرده‌ای، دوباره سکه‌هایت را به چاه ویل خواهی انداخت! شبح تصمیم‌های کهنه هنوز بر دست‌هایت زنجیر زده است.',
      dangerLevelPercent: 76,
      dangerLevelFa: 'خطر اسارت در گذشته (۷۶٪)',
      protectiveCharmFa: 'با خودت زمزمه کن: «پولی که رفته مثل آب ریخته است؛ فقط آینده را باید نجات داد.»',
      omenSignFa: '⏳ ساعت شنی شکسته',
    };
  }

  // Prophecy: Ambiguity Intolerance
  if (ambiguityFails >= 2) {
    return {
      biasNameFa: 'ترس از گفتن نمی‌دانم و نیت‌خوانی خیالی',
      oracleTitleFa: 'فال آینه‌های تاریک: سایه‌بافی در ابهام',
      oracleWhisperFa:
        'در ایستگاه بعدی، وقتی اطلاعات نصفه‌نیمه است، سکوت طرف مقابل را به دلخوری یا توطئه تعبیر خواهی کرد! ذهن تو تاب خالی ماندن صفحه را ندارد و جای خالی را با ترس‌های درونیت پر می‌کند.',
      dangerLevelPercent: 72,
      dangerLevelFa: 'حدس‌های شتاب‌زده (۷۲٪)',
      protectiveCharmFa: 'شجاعت مقدس «اطلاعات کافی نیست» را به یاد بیاور؛ همه چیز محتاج قضاوت آنی تو نیست!',
      omenSignFa: '🌫️ نقاب در سایه‌روشن',
    };
  }

  // Prophecy: Highly alert
  return {
    biasNameFa: 'کمین شیطان جزئیات',
    oracleTitleFa: 'فال آینه صیقلی: رخنه در دژ فولادین',
    oracleWhisperFa:
      'گوی بلورین مات شده! قلعه ذهنت تاکنون مقاومتی مثال‌زدنی نشان داده است. اما مراقب باش؛ صیادان این تالار در بازی بعدی، یک تله منطقی بسیار نامحسوس و آراسته به ظاهر علمی سر راهت خواهند گذاشت تا در کمال آرامش بلغزی!',
    dangerLevelPercent: 55,
    dangerLevelFa: 'کمین نامرئی (۵۵٪)',
    protectiveCharmFa: 'به واژه‌های کوچک مثل «همیشه»، «هیچ‌کدام» و فرمول‌های احتمال دقت دوچندان بکن!',
    omenSignFa: '👁️ چشم ناظر در تاریکی',
  };
}
